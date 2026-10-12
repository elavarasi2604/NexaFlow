import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, default: "FILE" },
    size: { type: Number, default: 0 },
    mimeType: { type: String, default: "application/octet-stream" },
    data: { type: Buffer, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Document", documentSchema);
