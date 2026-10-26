import { ADMIN_MODEL_DEFINITIONS } from "@/lib/admin-data-models";
import authenticateUser, { isAdminUser } from "@/lib/auth";

export async function GET(request: Request) {
  const currentUser = await authenticateUser(request);
  if (!isAdminUser(currentUser)) {
    return Response.json({ message: "Unauthorized. Admin access required." }, { status: 403 });
  }

  return Response.json(
    {
      models: ADMIN_MODEL_DEFINITIONS.map((definition) => ({
        ...definition,
        fields: definition.fields.filter((field) => !field.sensitive || field.writeOnly),
      })),
    },
    { status: 200 }
  );
}
