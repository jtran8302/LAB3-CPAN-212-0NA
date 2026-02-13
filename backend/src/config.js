import path from "path";

export const config = {
  // Path to JSON data file
    DATA_FILE: path.join(process.cwd(), "data", "incidents.json"),

  // By default, archived incidents are NOT shown on dashboard
    DEFAULT_SHOW_ARCHIVED: false,

  // All possible status values
    STATUS: {
        OPEN: "OPEN",
        INVESTIGATING: "INVESTIGATING",
        RESOLVED: "RESOLVED",
        ARCHIVED: "ARCHIVED"
    }
};
