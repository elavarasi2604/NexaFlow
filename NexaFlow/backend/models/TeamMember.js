import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "Developer" },
    initial: { type: String, default: "U" }
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
