import { promises as fs } from "fs";
import path from "path";

// Define the type for JSON data
type JsonRecord = { [key: string]: any };

/**
 * Converts an array of JSON objects to a CSV string, sorting by rollNo in descending order,
 * and includes SGPA for sem1 to sem8 as individual columns before the instituteName column.
 * @param jsonData - Array of JSON objects to convert.
 * @returns CSV string.
 */
function jsonToCsv(jsonData: JsonRecord[]): string {
  if (jsonData.length === 0) return '';

  // Sort the JSON data by rollNo in descending order
  jsonData.sort((a, b) => b.rollNo.localeCompare(a.rollNo));

  // Gather headers, placing SGPA columns before instituteName
  const baseHeaders = Object.keys(jsonData[0]).filter(key => key !== "SGPA" && key !== "instituteName");
  const sgpaHeaders = Array.from({ length: 8 }, (_, i) => `SGPA_sem${i + 1}`);
  const headers = [...baseHeaders, ...sgpaHeaders, "instituteName"];

  // Generate the CSV rows
  const csvRows = jsonData.map((row) => {
    // Add base properties (excluding instituteName)
    const rowData = baseHeaders.map((header) => JSON.stringify(row[header] || ""));
    
    // Add SGPA properties (sem1 to sem8)
    const sgpaData = sgpaHeaders.map((header) => {
      const semester = header.split("_")[1]; // "sem1", "sem2", ..., "sem8"
      return JSON.stringify(row.SGPA?.[semester] || "");
    });

    // Add instituteName at the end
    const instituteNameData = JSON.stringify(row.instituteName || "");

    // Combine rowData, sgpaData, and instituteNameData
    return [...rowData, ...sgpaData, instituteNameData].join(",");
  });

  // Add the headers as the first row
  return [headers.join(","), ...csvRows].join("\n");
}

/**
 * Reads a JSON file, converts it to CSV, and writes it to a new file.
 * @param inputFilePath - Path to the JSON file.
 * @param outputFilePath - Path to save the converted CSV file.
 */
export async function convertJsonFileToCsv(inputFilePath: string, outputFilePath: string): Promise<void> {
  try {
    // Read the JSON data from the file
    const data = await fs.readFile(inputFilePath, "utf-8");
    const jsonData: JsonRecord[] = JSON.parse(data);

    // Convert JSON data to CSV
    const csvData = jsonToCsv(jsonData);

    // Write the CSV data to a new file
    await fs.writeFile(outputFilePath, csvData, "utf-8");

    console.log(`CSV file has been saved to ${outputFilePath}`);
  } catch (error) {
    console.error("Error converting JSON to CSV:", error);
  }
}
// Example usage
const inputFilePath = path.join(__dirname, "../out/results.json");
const outputFilePath = path.join(__dirname, "../out/results.csv");


// convertJsonFileToCsv(inputFilePath, outputFilePath);

