import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const tasks = await Task.find();
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Completed").length;
    const pending = tasks.filter(t => t.status === "Pending").length;
    const progress = tasks.filter(t => t.status === "In Progress").length;
    const high = tasks.filter(t => t.priority === "High").length;
    res.json({
      total,
      completed,
      pending,
      inProgress: progress,
      highPriority: high,
      completionRate: total ? Math.round(completed / total * 100) : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load analytics", error: err.message });
  }
});

export default router;
