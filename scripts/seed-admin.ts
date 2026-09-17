import connection from "../lib/database";
import User from "../modules/user/models/user.model";
import bcrypt from "bcrypt";

async function seedAdmin() {
  await connection();

  const email = process.env.ADMIN_EMAIL || "admin@matribhasha.local";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "Matribhasha Admin";
  const username = process.env.ADMIN_USERNAME || "admin";

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log(`Admin already exists for ${email}`);
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("Updated existing user role to admin.");
    }
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    username,
    email,
    password: hashedPassword,
    role: "admin",
  });

  console.log(`Admin created successfully: ${email}`);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
