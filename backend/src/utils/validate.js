export const categories = ["IT", "SAFETY", "FACILITIES", "OTHER"];
export const severities = ["LOW", "MEDIUM", "HIGH"];

export function validateCreateIncident(body) {

  const errors = [];

  if (!body.title || body.title.length < 5) {
    errors.push("Invalid title");
  }

  if (!body.description || body.description.length < 10) {
    errors.push("Invalid description");
  }

  if (!body.category) {
    errors.push("Invalid category");
  }

  if (!body.severity) {
    errors.push("Invalid severity");
  }

  return {
    ok: errors.length === 0,
    errors,
    value: body
  };
}


export function validateStatusChange(current, next) {

  // Allowed status transitions for Lab 3
  const transitions = {
    OPEN: ["INVESTIGATING", "ARCHIVED"],      // OPEN can go to ARCHIVED
    INVESTIGATING: ["RESOLVED"],              // INVESTIGATING cannot archive
    RESOLVED: ["ARCHIVED"],                   // RESOLVED can archive
    ARCHIVED: ["OPEN"]                        // ARCHIVED can only reset to OPEN
  };

  // If current status is not valid
  if (!transitions[current]) {
    return { ok: false, error: "Invalid current status" };
  }

  // If next status is not allowed
  if (!transitions[current].includes(next)) {
    return { ok: false, error: "Invalid status transition" };
  }

  return { ok: true, next };
}
