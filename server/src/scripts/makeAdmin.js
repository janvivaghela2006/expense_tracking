import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.log('Usage: npm run make-admin -- "user@example.com"');
  process.exit(1);
}

try {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    console.log(`User not found for email: ${email}`);
    process.exit(1);
  }

  user.role = "admin";
  await user.save();

  console.log(`Admin role assigned successfully to: ${user.email}`);
} catch (error) {
  console.error("Failed to make admin:", error.message);
  process.exit(1);
} finally {
  await mongoose.connection.close();
}
