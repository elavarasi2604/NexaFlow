import express from "express";
import TeamMember from "../models/TeamMember.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try { res.json(await TeamMember.find().sort({ createdAt: 1 })); }
  catch (err) { res.status(500).json({ message: "Failed to load team", error: err.message }); }
});

router.post("/", async (req, res) => {
  try {
    const member = await TeamMember.create({
      ...req.body,
      initial: (req.body.name || "U").trim()[0].toUpperCase()
    });
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: "Failed to add member", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try { await TeamMember.findByIdAndDelete(req.params.id); res.json({ ok: true }); }
  catch (err) { res.status(500).json({ message: "Failed to remove member", error: err.message }); }
});

export default router;
