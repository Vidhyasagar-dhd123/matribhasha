import connection from "@/lib/database";
import User from "@/modules/user/models/user.model";
import authenticateUser from "@/lib/auth";
import { hashPassword } from "@/modules/auth/utils/password";


export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connection()
        const { id } = await params;

        const body = await req.json();

        const currentUser = await authenticateUser(req) as { id?: string; _id?: string; role?: string } | null

        if (!currentUser || (currentUser.id !== id && currentUser._id !== id && currentUser.role !== "admin")) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const { password } = body;

        if (!password || password.length < 6) {
            return Response.json({ message: "Password must be at least 6 characters long" }, { status: 400 });
        }
        const hashedPassword = await hashPassword(password)
        const user = await User.findOneAndUpdate({ _id: id }, { $set: { password: hashedPassword } }, { new: true }).select("_id name email role isBlocked");

        if (!user) {
            return Response.json({ message: "User Not Found" }, { status: 404 });
        }
        return Response.json({ message: "Password Updated Successfully", user }, { status: 200 });
    } catch (err) {
        console.log(`Error Resetting Password: ${err}`)
        return Response.json({ message: "Internal Server Error" }, { status: 500 })
    }
}