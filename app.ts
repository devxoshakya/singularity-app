import chalk from "chalk";
import readline from "readline";
import { processRollNumbers } from "./utils/helper"; // Assume this function processes roll numbers and returns true
import { convertJsonFileToCsv } from "./utils/csv"; // Assume this function converts JSON to CSV
// Assume this function converts JSON to CSV

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }


/**
 * Prompts the user with a question and returns their response as a promise.
 * @param question - The question to prompt the user with.
 * @returns User's response as a promise.
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

/**
 * Main function to run the result extraction process.
 */
async function main() {
  console.clear();  
  console.log(chalk.blueBright.bold("🚀 SINGULARITY : A modern result extraction platform 🚀"));

  // Prompt for roll number check
  const rollCheckResponse = await prompt(
    chalk.green("📜 Are roll numbers added? (y/n): ")
  );

  if (rollCheckResponse.toLowerCase() === "y") {
    console.log(chalk.yellow("⏳ Processing roll numbers..."));
    await delay(1500);
    const processingSuccess = await processRollNumbers();

    if (processingSuccess) {
      // After processing is complete, ask if the user wants CSV export
      const csvExportResponse = await prompt(
        chalk.cyan("📁 Do you want the results in CSV format? (y/n): ")
      );

      if (csvExportResponse.toLowerCase() === "y") {
         convertJsonFileToCsv("out/results.json", "out/results.csv");
        console.log(chalk.green("✅ Results extraction done successfully in CSV format."));
      } else {
        console.log(chalk.magenta("✅ Results extraction done without CSV export."));
      }
    } else {
      console.log(chalk.red("❌ Processing failed. Please check the logs for errors."));
    }
  } else {
    console.log(chalk.red("⚠️ Please add roll numbers and try again."));
  }

  rl.close();
}

// Run the main function
main();
