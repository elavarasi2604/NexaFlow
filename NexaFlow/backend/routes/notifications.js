import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    res.json(await Notification.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications", error: err.message });
  }
});

router.patch("/read-all", async (_req, res) => {
  try {
    await Notification.updateMany({}, { read: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update notifications", error: err.message });
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json(n);
  } catch (err) {
    res.status(500).json({ message: "Failed to update notification", error: err.message });
  }
});

export default router;
