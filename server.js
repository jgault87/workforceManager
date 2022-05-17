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
  generateArrs();
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
          "Add an Employee",
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
  db.query(
    "SELECT department_name AS Departments FROM departments",
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.table("\x1b[36m", results);
      }
      openPrompt();
    }
  );

//function to view all roles

const roleView = () =>
  db.query(
    `SELECT roles.id AS id, 
    roles.title AS title,
    department_name AS department,
    roles.salary AS salary FROM roles
    JOIN departments ON roles.department_id = departments.id
   `,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.table("\x1b[36m", results);
      }
      openPrompt();
    }
  );

//function to view all employees
const empView = () =>
  db.query(
    `SELECT employees.id AS id,
  employees.first_name AS first_name,
  employees.last_name AS last_name,
  roles.title AS title,
  departments.department_name AS department,
  roles.salary AS salary,
  concat(manager.first_name, " " , manager.last_name) AS manager
  FROM employees
  JOIN roles ON employees.role_id = roles.id
  JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees manager ON employees.manager_id = manager.id`,
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        console.table("\x1b[36m", results);
      }
      openPrompt();
    }
  );

//function to add department
const deptAdd = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Enter the name of the department you would like to add",
        name: "newDepartment",
      },
    ])
    .then((res) => {
      db.query(
        "INSERT INTO departments (department_name) VALUES (?)",
        res.newDepartment,
        (err, results) => {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `New Department ${res.newDepartment} has been added successfully`
            );
          }
          openPrompt();
        }
      );
    });
};

//add role function
const roleAdd = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "What is the name of the role?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role?",
      },
      {
        type: "list",
        name: "dept",
        message: "Which department does the role belong to?",
        choices: deptArr,
      },
    ])
    .then((res) => {
      let deptID;
      db.query(
        `SELECT (id) FROM departments WHERE department_name=(?)`,
        res.dept,
        (err, results) => {
          if (err) {
            console.error(err);
          } else {
            deptID = results[0].id;
          }

          db.query(
            `INSERT INTO roles (title, department_id, salary) VALUES (?, ?, ?)`,
            [res.role, deptID, res.salary],
            (err, results) => {
              if (err) {
                console.error(err);
              } else {
                roleArr.push(res.role);
                console.log(`New Role ${res.role} has been added successfully`);
              }
              openPrompt();
            }
          );
        }
      );
    });
};


// add employee function
const empAdd = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first",
        message: "What is the employees first name?",
      },
      {
        type: "input",
        name: "last",
        message: "What is the employees last name?",
      },
      {
        type: "list",
        name: "role",
        message: "What is the employees role?",
        choices: roleArr,
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employees manager?",
        choices: managerArr,
      },
    ])
    .then((res) => {
      let roleID;
      const managerIdArr = res.manager.split(" ");
      let managerID;

      db.query(
        `SELECT (id) FROM roles WHERE title=(?)`,
        res.role,
        (err, results) => {
          if (err) {
            console.error(err);
          } else {
            roleID = results[0].id;
          }

          db.query(
            `SELECT (id) FROM employees WHERE first_name=(?) AND last_name=(?)`,
            [managerIdArr[1], managerIdArr[2]],
            (err, results) => {
              if (err) {
                console.error(err);
              } else {
                managerID = results[0].id;
                insertEmp();
              }
            }
          );

          const insertEmp = () => {
            const params = [res.first, res.last, roleID, managerID];
            db.query(
              `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
              params,
              (err, results) => {
                if (err) {
                  console.error(err);
                } else {
                  empArr.push(`${res.first} ${res.last}`);
                  console.log(
                    `\x1b[36m Employee ${res.first} ${res.last} successfully added!`
                  );
                }
                openPrompt();
              }
            );
          };
        }
      );
    });
};

const updateRole = () => {};

//initialize function to open prompt and generate arrays from db for further prompts
function init() {
  openPrompt();
}

init();

const deptArr = [];
const roleArr = [];
const empArr = [];
const managerArr = [];

//populate arrays to display/call updated information in inquirer
function generateArrs() {
  db.query(`SELECT * FROM departments`, (err, results) => {
    if (err) {
      console.error(err);
    }
    for (let departments of results) {
      deptArr.push(`${departments.department_name}`);
    }
    // console.log(deptArr);
  });

  db.query(`SELECT * FROM employees`, (err, results) => {
    if (err) {
      console.error(err);
    }
    for (let employees of results) {
      empArr.push(`${employees.first_name} ${employees.last_name}`);
    }
    // console.log(empArr);
  });

  db.query(`SELECT * FROM roles`, (err, results) => {
    if (err) {
      console.error(err);
    }
    for (let roles of results) {
      roleArr.push(`${roles.title}`);
    }
    // console.log(roleArr);
  });

  db.query(`SELECT * FROM employees`, (err, results) => {
    if (err) {
      console.error(err);
    }
    for (let roles of results) {
      roleArr.push(`${roles.title}`);
    }
    // console.log(roleArr);
  });

  db.query(`SELECT * FROM employees`, (err, results) => {
    if (err) {
      console.error(err);
    }
    for (let manager of results) {
      if (manager.manager_id !== null) {
        managerArr.push(
          `${manager.manager_id} ${manager.first_name} ${manager.last_name}`
        );
      }
    }
    // console.log(managerArr);
  });
}
