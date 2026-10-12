import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    res.json(await Message.find().sort({ createdAt: 1 }));
  } catch (err) {
    res.status(500).json({ message: "Failed to load messages", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    res.status(201).json(await Message.create(req.body));
  } catch (err) {
    res.status(400).json({ message: "Failed to send message", error: err.message });
  }
});

export default router;
