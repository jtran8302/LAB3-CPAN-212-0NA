// ES6 are here
// These are the most basic configuration.
import express from "express";
import cors from "cors";

// This is a router
import incidentsRouter from "./routes/incidents.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// In practice, its not good to have everything in one file.
// SOLID, single responsibility.
// Every file only serves one class, one function.
// Router is here to routine request.
app.use("/api/incidents", incidentsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// a handleException.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
