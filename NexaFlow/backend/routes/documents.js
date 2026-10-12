import express from "express";
import multer from "multer";
import Document from "../models/Document.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get("/", async (_req, res) => {
  try {
    const docs = await Document.find().select("-data").sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load documents", error: err.message });
  }
});

router.post("/", upload.array("files", 10), async (req, res) => {
  try {
    const docs = await Promise.all(
      req.files.map(file =>
        Document.create({
          name: file.originalname,
          type: file.originalname.split(".").pop()?.toUpperCase() || "FILE",
          size: file.size,
          mimeType: file.mimetype,
          data: file.buffer
        })
      )
    );
    res.status(201).json(docs.map(d => ({ ...d.toObject(), data: undefined })));
  } catch (err) {
    res.status(400).json({ message: "Failed to upload documents", error: err.message });
  }
});

router.get("/:id/download", async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.setHeader("Content-Type", doc.mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.name)}"`);
    res.send(doc.data);
  } catch (err) {
    res.status(500).json({ message: "Failed to download document", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete document", error: err.message });
  }
});

export default router;
