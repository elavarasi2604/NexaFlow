import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, default: "workspace" },
    name: { type: String, default: "Elavarasi" },
    email: { type: String, default: "elavarasi@example.com" },
    role: { type: String, default: "User" },
    notifications: { type: Boolean, default: true },
    summary: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
