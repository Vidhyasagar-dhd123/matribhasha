import bcrypt from "bcrypt";
import connection from "@/lib/database";
import {
  getAdminModel,
  getAdminModelDefinition,
  getPayload,
  type AdminRecord,
} from "@/lib/admin-data-models";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import mongoose from "mongoose";

function parseExactValue(value: string, type: string): unknown {
  if (type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  if (type === "boolean") {
    if (value !== "true" && value !== "false") return undefined;
    return value === "true";
  }
  return value;
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

  const url = new URL(request.url);
  const fieldName = url.searchParams.get("field");
  const rawValue = url.searchParams.get("value");
  const field = definition.fields.find(
    (candidate) =>
      candidate.name === fieldName &&
      candidate.editable !== false &&
      candidate.type !== "relation" &&
      !candidate.sensitive
  );
  if (!field || rawValue === null) {
    return Response.json({ message: "A valid scalar field and value are required" }, { status: 400 });
  }

  const value = parseExactValue(rawValue, field.type);
  if (value === undefined) {
    return Response.json({ message: "The value does not match the selected field type" }, { status: 400 });
  }

  try {
    await connection();
    const records = await model.find({ [field.name]: value }).select("_id").limit(5000).lean();
    return Response.json({
      ids: records.map((record) => String(record._id)),
      count: records.length,
      capped: records.length === 5000,
    });
  } catch (error) {
    console.error(`Admin data model bulk selection error for ${modelName}:`, error);
    return Response.json({ message: "Unable to select matching records" }, { status: 500 });
  }
}

export async function PATCH(
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
    const body = (await request.json()) as { ids?: unknown; updates?: AdminRecord };
    if (
      !Array.isArray(body.ids) ||
      body.ids.length === 0 ||
      body.ids.length > 500 ||
      body.ids.some((id) => typeof id !== "string" || !mongoose.isValidObjectId(id))
    ) {
      return Response.json({ message: "Provide between 1 and 500 valid record IDs" }, { status: 400 });
    }
    if (!body.updates || Object.keys(body.updates).length !== 1) {
      return Response.json({ message: "Bulk update requires exactly one field" }, { status: 400 });
    }

    await connection();
    const updates = getPayload(body.updates, definition.fields);
    if (Object.keys(updates).length !== 1) {
      return Response.json({ message: "The selected field cannot be updated" }, { status: 400 });
    }
    if (modelName === "User" && typeof updates.password === "string") {
      if (!updates.password) delete updates.password;
      else updates.password = await bcrypt.hash(updates.password, 12);
    }
    if (!Object.keys(updates).length) {
      return Response.json({ message: "The update value cannot be empty" }, { status: 400 });
    }

    const result = await model.updateMany(
      { _id: { $in: body.ids.map((id) => new mongoose.Types.ObjectId(id)) } },
      { $set: updates },
      { runValidators: true }
    );

    return Response.json({
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error(`Admin data model bulk PATCH error for ${modelName}:`, error);
    return Response.json(
      { message: error instanceof Error ? error.message : "Unable to bulk update records" },
      { status: 400 }
    );
  }
}
