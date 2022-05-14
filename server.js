const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bootcampsql',
        database: 'employees_db'
    },
    console.log('Connected to employee database')
);


const openPrompt = () => {
    inquirer.prompt([
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
          case "Update an Employee Role":
            updateRole();
            break;
          case "Exit":
            db.end();
            break;
           
          default:
            console.log('something wrong with code')
        }
      });
  }
  


const deptView = () => {}
const roleView = () => {}
const empView = () => {}
const deptAdd = () => {}
const roleAdd = () => {}
const updateRole = () => {}







  function init() {
      openPrompt();
  }

  init();