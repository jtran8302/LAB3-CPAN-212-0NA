import express from "express";
// import express module

import multer from "multer";

import { listAll, findById, createIncident, updateStatus } from "../store/incidents.store.js";
import { parseCsvBuffer } from "../utils/csv.js";
import { validateCreateIncident, validateStatusChange } from "../utils/validate.js";
// import functionality

const router = express.Router();
// Specifying booean 

const upload = multer({ storage: multer.memoryStorage() });
// managing in-memory storage


// request with parameter
router.get("/", (req, res) => {

  // Read query parameter: ?showArchived=true
  const showArchived = req.query.showArchived === "true";

  res.json(listAll({ includeArchived: showArchived }));
});


// GET single 
router.get("/:id", (req, res) => {
  const incident = findById(req.params.id);
  if (!incident) {
    return res.status(404).json({ error: "Incident not found" });
  }
  res.json(incident);
});


// validate create incident
router.post("/", (req, res) => {
  const result = validateCreateIncident(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.errors });
  }

  const incident = createIncident(result.value);
  res.status(201).json(incident);
});

// corresponding
router.patch("/:id/status", (req, res) => {
  const incident = findById(req.params.id);
  if (!incident) return res.status(404).json({ error: "Incident not found" });

  const check = validateStatusChange(incident.status, req.body.status);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const updated = updateStatus(incident.id, check.next);
  res.json(updated);
});

router.post("/bulk-upload", upload.single("file"), async (req, res) => {
  const records = await parseCsvBuffer(req.file.buffer);

  let created = 0;
  let skipped = 0;

  records.forEach(row => {
    const result = validateCreateIncident(row);
    if (!result.ok) {
      skipped++;
      return;
    }
    createIncident(result.value);
    created++;
  });

  res.json({
    totalRows: records.length,
    created,
    skipped
  });
});

export default router;
