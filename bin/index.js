#!/usr/bin/env node
import fs from "fs";
// console.log(process.argv);
// [
//   'C:\\Users\\cheta\\.nvm\\versions\\node\\v22.1.0\\bin\\node.exe',
//   'C:\\Users\\cheta\\.nvm\\versions\\node\\v22.1.0\\bin\\node_modules\\expense-tracker\\bin\\index.js',
//   'add',
//   '--description',
//   'Lunch',
//   '--amount',
//   '20'
// ]

const directory_name = "data.json";

if (!fs.existsSync(directory_name)) {
  fs.writeFileSync(directory_name, JSON.stringify([]));
}

const method = process.argv[2];

switch (method) {
  case "add":
    addExpense();
    break;
  case "list":
    showList();
    break;
  case "summary":
    showSummary();
    break;
  case "delete":
    deleteExpense();
    break;
  case "help":
    showHelp();
    break;
  default:
    console.log("Please check if command is valid or not");
    break;
}

function showHelp() {
  console.log("Expense Manager Help:");
  console.log("1. add - Adds a new expense. ");
  console.log("2. list - Lists all recorded expenses.");
  console.log(
    "3. summary - Provides a summary of total expenses, categorized if applicable."
  );
  console.log("4. delete - Deletes a specific expense.");
  console.log("5. help - Displays this help message.");
  console.log("Use valid commands to manage your expenses effectively.");
}

function addExpense() {
  const op1 = process.argv[3];
  if (op1 !== "--description") {
    throw new Error("Invalid 2nd argument. Expected '--description'.");
  }
  const op2 = process.argv[5];
  if (op2 !== "--amount") {
    throw new Error("Invalid 4th argument. Expected '--amount'.");
  }
  let myObject = JSON.parse(fs.readFileSync(directory_name));
  const description = process.argv[4];
  const amount = process.argv[6];
  if (parseInt(amount) < 0) {
    throw new Error("Amount cannot be negative");
  }
  const task = {
    id: (myObject.length + 1).toString(),
    description: description,
    createdAt: new Date().toLocaleDateString(),
    amount: amount,
  };
  myObject.push(task);
  console.log(`Expense added successfully (ID: ${myObject.length})`);
  fs.writeFileSync(directory_name, JSON.stringify(myObject));
}
function showList() {
  let myObject = JSON.parse(fs.readFileSync(directory_name));
  if (myObject.length === 0) {
    console.log("List is empty");
    return;
  }
  console.log(
    "#" + "ID" + "   " + "DATE" + "    " + "DESCRIPTION" + "    " + "AMOUNT"
  );
  for (let i = 0; i < myObject.length; i++) {
    console.log(
      "#" +
        `${myObject[i].id}` +
        " " +
        `${myObject[i].createdAt}` +
        " " +
        `${myObject[i].description}` +
        " " +
        `${myObject[i].amount}`
    );
  }
}
function showSummary() {
  const op = process.argv[3];
  let totalExpenses = 0;
  let myObject = JSON.parse(fs.readFileSync(directory_name));
  if (op) {
    if (op != "--month") {
      throw new Error("wrong 2nd argument");
    }
    const month = parseInt(process.argv[4]);
    if (!(month >= 1 && month <= 12)) {
      throw new Error("Enter valid month in numerical format");
    }
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let i = 0; i < myObject.length; i++) {
      let monthInNumber = parseInt(myObject[i].createdAt.split("/")[1]);
      if (month == monthInNumber) {
        totalExpenses += parseInt(myObject[i].amount);
      }
    }
    console.log(
      `Total expenses for ${months[month - 1]}: ` + "$" + totalExpenses
    );
    return;
  }
  myObject.map((element) => (totalExpenses += parseInt(element.amount)));
  console.log("Total expenses: " + "$" + totalExpenses);
}
function deleteExpense() {
  const op = process.argv[3];
  if (op != "--id" || op == undefined) {
    throw new Error("wrong 2nd argument");
  }
  const id = process.argv[4];
  if (!id) {
    throw new Error("please enter id of expense to be deleted");
  }
  let myObject = JSON.parse(fs.readFileSync(directory_name));
  const exists = myObject.find((element) => element.id === id);
  if (exists) {
    myObject = myObject.filter(function (element) {
      return element.id !== id;
    });
    console.log("Expense deleted successfully!");
  } else {
    console.log("Task dosen't exist in file");
  }
  fs.writeFileSync(directory_name, JSON.stringify(myObject));
}
