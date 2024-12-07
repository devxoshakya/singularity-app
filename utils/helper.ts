import { promises as fs } from "fs";
import path from "path";
import { solver } from "./solver";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type SolverResult = any;

export async function processRollNumbers(): Promise<Boolean> {
  const inputFilePath: string = path.join(__dirname, "../src/rollNumbers.txt");
  const outputFilePath: string = path.join(__dirname, "../out/results.json");
  const logsFilePath: string = path.join(__dirname, "../utils/logs.txt");
  
  try {
    let results: SolverResult[] = [];
    
    try {
      const resultsData: string = await fs.readFile(outputFilePath, "utf-8");
      results = JSON.parse(resultsData);
    } catch (error: any) {
      if (error.code !== "ENOENT") throw error;
    }
    
    while (true) {
      const rollNumbersData: string = await fs.readFile(inputFilePath, "utf-8");
      let rollNumbers: number[] = rollNumbersData
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map(Number);
        
      if (rollNumbers.length === 0) {
        console.log("All roll numbers processed. Exiting...");
        break;
      }
      
      for (let i = 0; i < rollNumbers.length; i++) {
        const rollNo: number = rollNumbers[i];
        
        // Clear the console and show only the current roll number
        console.clear();  // This is cross-platform and equivalent to \x1Bc in Node.js
        console.log(`Processing roll number: ${rollNo}`);
        
        const result: SolverResult = await solver(rollNo);
        
        if (result) {
          results.push(result);
        }
        
        rollNumbers = rollNumbers.filter((r) => r !== rollNo);
        await fs.writeFile(
          outputFilePath,
          JSON.stringify(results, null, 2),
          "utf-8"
        );
        await fs.writeFile(inputFilePath, rollNumbers.join("\n"), "utf-8");
        await fs.appendFile(logsFilePath, rollNo + "\n", "utf-8");
        
        await delay(100);
      }
    }
    
    console.log("Processing completed successfully.");
    return true;
  } catch (error: any) {
    console.error("Error during processing:", error);
    return false;
  }
}

// processRollNumbers();
