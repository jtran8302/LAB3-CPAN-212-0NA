// Parser of the csv files
// Import csv-parse module to read csv
import { parse } from "csv-parse";

export function parseCsvBuffer(buffer) {

  // Promise, async concept
  // Everything inside will be executed in parallelism
  // CSV files can be huge, especially in banking
  // The following is how to execute to run async
  return new Promise((resolve, reject) => {
    const rows = [];

    const parser = parse({
      columns: true,
      trim: true
    });

    // "on" is subscribing an event
    // "on", "readable" means its ready for reading
    parser.on("readable", () => {
      let record;
      while ((record = parser.read()) !== null) {
        rows.push(record);
      }
    });

    // on, listen, event are what made up Node.js
    // reject an event
    parser.on("error", reject);
    parser.on("end", () => resolve(rows));

    // parser end
    parser.write(buffer);
    parser.end();
  });
}
