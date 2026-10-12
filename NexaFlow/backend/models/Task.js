import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending"
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium"
    },
    dueDate: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString().slice(0, 10) }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
