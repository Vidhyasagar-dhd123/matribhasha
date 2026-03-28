import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";
import authenticateUser from "@/lib/auth";


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connection()
        const { id } = await params;

        const body = await req.json();

        const isValid = await authenticateUser(req)

        if (!isValid) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        console.log(`Password Reset Request for ID: ${id}`)
        console.log("Request Body:", body)
        const { password } = body;

        if (!password || password.length < 6) {
            return Response.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
        }
        const user = await User.findOneAndUpdate({ _id: id }, { $set: { password: password } }, { new: true });

        if (!user) {
            return Response.json({ message: "User Not Found" }, { status: 404 });
        }
        console.log("Password Updated for User:", user)
        return Response.json({ message: "Password Updated Successfully", user }, { status: 200 });
    } catch (err) {
        console.log(`Error Resetting Password: ${err}`)
    }
}