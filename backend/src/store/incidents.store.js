import { randomUUID } from "crypto";
import fs from "fs";
import { config } from "../config.js";

// Make sure data file exists before reading or writing
function ensureDataFile() {
  if (!fs.existsSync(config.DATA_FILE)) {
    fs.writeFileSync(config.DATA_FILE, "[]", "utf8");
  }
}

// Read all incidents from JSON file
function readAll() {
  ensureDataFile();
  const raw = fs.readFileSync(config.DATA_FILE, "utf8");
  const data = JSON.parse(raw || "[]");
  return Array.isArray(data) ? data : [];
}

// Write all incidents back to JSON file
function writeAll(incidents) {
  ensureDataFile();
  fs.writeFileSync(config.DATA_FILE, JSON.stringify(incidents, null, 2), "utf8");
}

// List incidents (optionally include archived)
export function listAll({ includeArchived = config.DEFAULT_SHOW_ARCHIVED } = {}) {
  const incidents = readAll();

  // If includeArchived is false, hide archived records
  if (!includeArchived) {
    return incidents.filter(i => i.status !== config.STATUS.ARCHIVED);
  }

  return incidents;
}

// Find incident by id
export function findById(id) {
  const incidents = readAll();
  return incidents.find(i => i.id === id);
}

// Create new incident
export function createIncident(data) {
  const incidents = readAll();

  const incident = {
    id: randomUUID(),
    ...data,
    status: config.STATUS.OPEN,
    reportedAt: new Date().toISOString()
  };

  incidents.push(incident);
  writeAll(incidents);

  return incident;
}

// Update incident status
export function updateStatus(id, status) {
  const incidents = readAll();
  const incident = incidents.find(i => i.id === id);

  if (!incident) return null;

  incident.status = status;
  writeAll(incidents);

  return incident;
}
