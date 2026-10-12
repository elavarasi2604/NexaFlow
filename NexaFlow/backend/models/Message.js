import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, default: "User" },
    text: { type: String, required: true, trim: true },
    time: { type: String, default: () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
