import bcrypt from "bcrypt";
import connection from "@/lib/database";
import {
  getAdminModel,
  getAdminModelDefinition,
  getPayload,
  serializeAdminRecord,
  type AdminRecord,
} from "@/lib/admin-data-models";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import mongoose from "mongoose";

const MAX_LIMIT = 50;

function parseValue(value: string, type: string): unknown {
  if (type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (type === "boolean") return value === "true";
  if (type === "relation") {
    return mongoose.isValidObjectId(value) ? new mongoose.Types.ObjectId(value) : undefined;
  }
  return value;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const currentUser = await authenticateUser(request);
  if (!isAdminUser(currentUser)) {
    return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  const { model: modelName } = await params;
  const definition = getAdminModelDefinition(modelName);
  const model = getAdminModel(modelName);
  if (!definition || !model) {
    return Response.json({ message: "Unknown data model" }, { status: 404 });
  }

  try {
    await connection();
    const url = new URL(request.url);
    const page = Math.max(Number(url.searchParams.get("page") || 1), 1);
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 20), 1), MAX_LIMIT);
    const query: AdminRecord = {};
    const search = url.searchParams.get("search")?.trim();

    for (const field of definition.fields) {
      if (!field.filterable || field.sensitive) continue;
      const value = url.searchParams.get(field.name);
      if (!value) continue;
      const parsed = parseValue(value, field.type);
      if (parsed !== undefined) query[field.name] = parsed;
    }

    if (search) {
      const searchableFields = definition.fields
        .filter((field) => field.type === "text" && field.filterable && !field.sensitive)
        .map((field) => field.name);
      if (searchableFields.length) {
        query.$or = searchableFields.map((name) => ({
          [name]: { $regex: escapeRegex(search), $options: "i" },
        }));
      }
    }

    const [records, total] = await Promise.all([
      model
        .find(query)
        .select("-password")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<AdminRecord[]>(),
      model.countDocuments(query),
    ]);

    return Response.json({
      model: definition,
      records: records.map(serializeAdminRecord),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error(`Admin data model GET error for ${modelName}:`, error);
    return Response.json({ message: "Unable to load model records" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ model: string }> }
) {
  const currentUser = await authenticateUser(request);
  if (!isAdminUser(currentUser)) {
    return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  const { model: modelName } = await params;
  const definition = getAdminModelDefinition(modelName);
  const model = getAdminModel(modelName);
  if (!definition || !model) {
    return Response.json({ message: "Unknown data model" }, { status: 404 });
  }

  try {
    await connection();
    const body = (await request.json()) as AdminRecord;
    const payload = getPayload(body, definition.fields);
    if (modelName === "User" && typeof payload.password === "string") {
      if (!payload.password) delete payload.password;
      else payload.password = await bcrypt.hash(payload.password, 12);
    }
    const created = await model.create(payload);
    return Response.json({ record: serializeAdminRecord(created.toObject()) }, { status: 201 });
  } catch (error) {
    console.error(`Admin data model POST error for ${modelName}:`, error);
    return Response.json({ message: error instanceof Error ? error.message : "Unable to create record" }, { status: 400 });
  }
}
