const inquirer = require("inquirer");
const mysql = require("mysql2");
const consoleTable = require("console.table");

//connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "bootcampsql",
    database: "employees_db",
  },
  console.log("Connected to employee database")
);

const openPrompt = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "Please select an option",
        name: "option",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add a Department",
          "Add a Role",
          "Update an Employee Role",
          "Exit",
        ],
      },
    ])
    //switch case for userselection
    .then(function (data) {
      switch (data.option) {
        case "View All Departments":
          deptView();
          break;
        case "View All Roles":
          roleView();
          break;
        case "View All Employees":
          empView();
          break;
        case "Add a Department":
          deptAdd();
          break;
        case "Add a Role":
          roleAdd();
          break;
          case "Add an Employee":
          empAdd();
          break;
        case "Update an Employee Role":
          updateRole();
          break;
        case "Exit":
          console.log("See ya");
          db.end();
          break;

        default:
          console.log("something wrong with code");
      }
    });
};

//function to view all departments

const deptView = () =>
  db.query("SELECT * FROM departments", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.table("\x1b[33m", results);
    }
    openPrompt();
  });

//function to view all roles

const roleView = () =>
  db.query("SELECT * FROM roles", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.table("\x1b[33m", results);
    }
    openPrompt();
  });

//function to view all employees
const empView = () =>
  db.query("SELECT * FROM employees", (err, results) => {
    if (err) {
      console.log(err);
    } else {
      console.table("\x1b[33m", results);
    }
    openPrompt();
  });


//function to add department
const deptAdd = () => {
  inquirer.prompt([
    {
      type: "input",
      message: "Enter the name of the department you would like to add",
      name: "newDepartment",
    },
  ])
  .then((res) => {
    db.query('INSERT INTO departments (department_name) VALUES (?)', res.newDepartment, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`New Department ${res.newDepartment} has been added successfully`);
      }
      openPrompt();
    })
  })
};

const roleAdd = () => {};
const empAdd = () => {};
const updateRole = () => {};

function init() {
  openPrompt();
}

init();
