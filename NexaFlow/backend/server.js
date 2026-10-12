import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import tasks from "./routes/tasks.js";
import messages from "./routes/messages.js";
import documents from "./routes/documents.js";
import notifications from "./routes/notifications.js";
import team from "./routes/team.js";
import settings from "./routes/settings.js";
import analytics from "./routes/analytics.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "NexaFlow API" });
});

app.use("/api/tasks", tasks);
app.use("/api/messages", messages);
app.use("/api/documents", documents);
app.use("/api/notifications", notifications);
app.use("/api/team", team);
app.use("/api/settings", settings);
app.use("/api/analytics", analytics);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error", error: err.message });
});

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nexaflow")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`NexaFlow API running at http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
