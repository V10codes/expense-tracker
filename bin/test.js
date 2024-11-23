import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

async function runCommand(command, description) {
  console.log(`\n### Testing: ${description}`);
  console.log(`Command: ${command}`);
  try {
    const { stdout, stderr } = await execPromise(command);

    if (stderr) {
      console.error(`Stderr:\n${stderr}`);
      throw new Error(`Command failed with stderr`);
    }
    console.log(`Output:\n${stdout}`);
    return true;
  } catch (error) {
    console.error(`Error:\n${error.message}`);
    return false;
  }
}

const commands = [
  {
    command: `expense-tracker add --description "Lunch" --amount 20`,
    description: "Add an expense (Lunch, $20)",
  },
  {
    command: `expense-tracker add --description "Dinner" --amount 30`,
    description: "Add another expense (Dinner, $30)",
  },
  {
    command: `expense-tracker list`,
    description: "List all expenses after adding Lunch and Dinner",
  },
  {
    command: `expense-tracker summary`,
    description: "Show total expenses summary",
  },
  {
    command: `expense-tracker summary --month 11`,
    description: "Show total expenses for November",
  },
  {
    command: `expense-tracker delete --id 1`,
    description: "Delete expense with ID 1 (Lunch)",
  },
  {
    command: `expense-tracker list`,
    description: "List all expenses after deletion of Lunch",
  },
];

async function runAllCommands() {
  let allTestCasesPassed = true;
  for (const { command, description } of commands) {
    const result = await runCommand(command, description);
    if (!result) {
      console.log(`Test failed: ${description}`);
      allTestCasesPassed = false;
      break;
    }
    console.log(`Test passed: ${description}`);
  }
  if (allTestCasesPassed) {
    console.log("All Test cases passed without error");
  }
}

runAllCommands();
