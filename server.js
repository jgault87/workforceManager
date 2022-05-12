const inquirer = require('inquirer');
const mysql = require('mysql2');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'bootcampsql',
        database: 'employees_db'
    },
    console.log(`Connected to employee database`)
);
