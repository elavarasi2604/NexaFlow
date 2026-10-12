import express from "express";
import Setting from "../models/Setting.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    let setting = await Setting.findOne({ key: "workspace" });
    if (!setting) setting = await Setting.create({ key: "workspace" });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings", error: err.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { key: "workspace" },
      { ...req.body, key: "workspace" },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(400).json({ message: "Failed to save settings", error: err.message });
  }
});

export default router;
