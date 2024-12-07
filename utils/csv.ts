import { promises as fs } from "fs";
import path from "path";

// Define the type for JSON data
type JsonRecord = {
  rollNo: string;
  enrollmentNo: string;
  fullName: string;
  fatherName: string;
  course: string;
  branch: string;
  SGPA: { [key: string]: number }; // SGPA object (e.g., sem1, sem2)
  CarryOvers: Array<{
    session: string;
    sem: string;
    cop: string;
  }>; // Array of CarryOver objects
  division: string;
  cgpa: string;
  instituteName: string;
};

/**
 * Converts an array of JSON objects to a CSV string, sorting by rollNo in descending order,
 * and includes SGPA for sem1 to sem8 as individual columns before the instituteName column.
 * @param jsonData - Array of JSON objects to convert.
 * @returns CSV string.
 */

function jsonToCsv(jsonData: JsonRecord[]): string {
  if (jsonData.length === 0) return "";

  // Sort the JSON data by rollNo in descending order
  jsonData.sort((a, b) => b.rollNo.localeCompare(a.rollNo));

  // Define base headers excluding dynamic fields
  const baseHeaders = [
    "rollNo",
    "enrollmentNo",
    "fullName",
    "fatherName",
    "course",
    "branch",
    "division",
    "cgpa",
  ];

  // SGPA headers (sem1 to sem8)
  const sgpaHeaders = Array.from({ length: 8 }, (_, i) => `SGPA_sem${i + 1}`);

  // Dynamic CarryOver headers
  const maxCarryOvers = Math.max(...jsonData.map((row) => row.CarryOvers?.length || 0));
  const carryOverHeaders = Array.from({ length: maxCarryOvers }, (_, i) => [
    `CarryOver_${i + 1}_session`,
    `CarryOver_${i + 1}_sem`,
    `CarryOver_${i + 1}_cop`,
  ]).flat();

  // Final headers, with CarryOver fields appended
  const headers = [...baseHeaders, ...sgpaHeaders, ...carryOverHeaders, "instituteName"];

  // Generate CSV rows
  const csvRows = jsonData.map((row) => {
    // Map base fields
    const rowData = baseHeaders.map((header) => row[header as keyof JsonRecord] || "");

    // Map SGPA fields (sem1 to sem8)
    const sgpaData = sgpaHeaders.map((header) => {
      const semester = header.split("_")[1]; // Extract semester (e.g., "sem1", "sem2")
      return row.SGPA?.[semester] || "";
    });

    // Map CarryOver fields
    const carryOverData = Array.from({ length: maxCarryOvers }, (_, i) => {
      const carryOver = row.CarryOvers?.[i];
      return [
        carryOver?.session || "",
        carryOver?.sem || "",
        carryOver?.cop || "",
      ];
    }).flat();

    // Add instituteName at the end
    const instituteNameData = row.instituteName || "";

    // Combine all fields into a CSV row
    return [...rowData, ...sgpaData, ...carryOverData, instituteNameData]
      .map((value) => `"${value}"`) // Wrap each value in quotes
      .join(",");
  });

  // Add headers as the first row
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

// Uncomment to run the conversion
// convertJsonFileToCsv(inputFilePath, outputFilePath);
