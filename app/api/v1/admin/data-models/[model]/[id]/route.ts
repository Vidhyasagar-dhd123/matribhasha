import bcrypt from "bcrypt";
import connection from "@/lib/database";
import {
  ADMIN_MODEL_DEFINITIONS,
  getAdminModel,
  getAdminModelDefinition,
  serializeAdminRecord,
  type AdminRecord,
} from "@/lib/admin-data-models";
import authenticateUser, { isAdminUser } from "@/lib/auth";
import mongoose from "mongoose";

async function authorize(request: Request) {
  const currentUser = await authenticateUser(request);
  return isAdminUser(currentUser);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  if (!(await authorize(request))) {
    return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }
  const { model: modelName, id } = await params;
  const model = getAdminModel(modelName);
  if (!getAdminModelDefinition(modelName) || !model || !mongoose.isValidObjectId(id)) {
    return Response.json({ message: "Invalid data model or record ID" }, { status: 400 });
  }
  try {
    await connection();
    let recordQuery = model.findById(id).select("-password");
    const forwardRelations = getAdminModelDefinition(modelName)?.fields.filter(
      (field) => field.type === "relation" && field.relation
    ) || [];

    for (const relation of forwardRelations) {
      recordQuery = recordQuery.populate({
        path: relation.name,
        select: "-password",
      }) as typeof recordQuery;
    }

    const record = await recordQuery.lean<AdminRecord | null>();
    if (!record) return Response.json({ message: "Record not found" }, { status: 404 });

    const reverseRelations = ADMIN_MODEL_DEFINITIONS.flatMap((relatedDefinition) =>
      relatedDefinition.fields
        .filter((field) => field.type === "relation" && field.relation === modelName)
        .map((field) => ({ definition: relatedDefinition, field }))
    );
    const relationships = await Promise.all(
      reverseRelations.map(async ({ definition: relatedDefinition, field }) => {
        const relatedModel = getAdminModel(relatedDefinition.name);
        if (!relatedModel) {
          return {
            direction: "reverse" as const,
            field: field.name,
            model: relatedDefinition.name,
            label: field.label,
            records: [],
          };
        }

        const relatedRecords = await relatedModel
          .find({ [field.name]: id })
          .select("-password")
          .sort({ createdAt: -1, _id: -1 })
          .lean<AdminRecord[]>();

        return {
          direction: "reverse" as const,
          field: field.name,
          model: relatedDefinition.name,
          label: field.label,
          records: relatedRecords.map(serializeAdminRecord),
        };
      })
    );

    return Response.json({
      record: serializeAdminRecord(record),
      relationships: [
        ...forwardRelations.map((field) => ({
          direction: "forward" as const,
          field: field.name,
          model: field.relation,
          label: field.label,
          records: Array.isArray(record[field.name])
            ? (record[field.name] as AdminRecord[]).map(serializeAdminRecord)
            : record[field.name]
              ? [serializeAdminRecord(record[field.name] as AdminRecord)]
              : [],
        })),
        ...relationships,
      ],
    });
  } catch (error) {
    console.error(`Admin data model detail error for ${modelName}:`, error);
    return Response.json({ message: "Unable to load record" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  if (!(await authorize(request))) {
    return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }
  const { model: modelName, id } = await params;
  const definition = getAdminModelDefinition(modelName);
  const model = getAdminModel(modelName);
  if (!definition || !model || !mongoose.isValidObjectId(id)) {
    return Response.json({ message: "Invalid data model or record ID" }, { status: 400 });
  }
  try {
    await connection();
    const body = (await request.json()) as AdminRecord;
    const payload: AdminRecord = {};
    for (const schemaField of definition.fields) {
      if (!schemaField.editable || !(schemaField.name in body)) continue;
      const value = body[schemaField.name];
      if (schemaField.type === "json" && typeof value === "string") {
        payload[schemaField.name] = JSON.parse(value);
      } else {
        payload[schemaField.name] = value;
      }
    }
    if (modelName === "User" && typeof payload.password === "string" && payload.password) {
      payload.password = await bcrypt.hash(payload.password, 12);
    } else if (modelName === "User" && !payload.password) {
      delete payload.password;
    }
    const updated = await model.findByIdAndUpdate(id, payload, { new: true, runValidators: true })
      .select("-password")
      .lean<AdminRecord | null>();
    if (!updated) return Response.json({ message: "Record not found" }, { status: 404 });
    return Response.json({ record: serializeAdminRecord(updated) });
  } catch (error) {
    console.error(`Admin data model PATCH error for ${modelName}:`, error);
    return Response.json({ message: error instanceof Error ? error.message : "Unable to update record" }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  if (!(await authorize(request))) {
    return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }
  const { model: modelName, id } = await params;
  const model = getAdminModel(modelName);
  if (!getAdminModelDefinition(modelName) || !model || !mongoose.isValidObjectId(id)) {
    return Response.json({ message: "Invalid data model or record ID" }, { status: 400 });
  }
  try {
    await connection();
    const deleted = await model.findByIdAndDelete(id).select("_id").lean();
    if (!deleted) return Response.json({ message: "Record not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    console.error(`Admin data model DELETE error for ${modelName}:`, error);
    return Response.json({ message: "Unable to delete record" }, { status: 400 });
  }
}
