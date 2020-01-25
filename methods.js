let inquirer = require("inquirer");
let mysql = require("mysql");
let employee = require("./employee");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "ptj92e",

    // Your password
    password: "novaPuppy216",
    database: "employeeDB"
});

function viewEmployees() {
    console.log("you did it");
};

function viewDepartments() {
    console.log("you did it");
};

function viewRoles() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "How much is the salary for this job?"
        }
    ]).then(function (data) {
        let query = "INSERT INTO department (name) VALUES (?)";
        connection.query(query, data.name);
        employee.manageEmployee();
    });
};

function addEmployee() {
    console.log("you did it");
};

function addDepartment() {
    inquirer.prompt({
        name: "name",
        type: "input",
        message: "What department would you like to add?"
    }).then(function (data) {
        let query = "INSERT INTO department (name) VALUES (?)";
        connection.query(query, data.name);
        employee.manageEmployee();
    });
};

function addRole() {
    console.log("you did it");
};

function updateRole() {
    console.log("you did it");
};

function assignManager() {
    console.log("you did it");
};

function viewManEmp() {
    console.log("you did it");
};

function deleteEmployee() {
    console.log("you did it");
};

function deleteDepartment() {
    console.log("you did it");
};

function deleteRole() {
    console.log("you did it");
};

function viewBudget() {
    console.log("you did it");
};

module.exports = {
    viewEmployees,
    viewDepartments,
    viewRoles,
    addEmployee,
    addDepartment,
    addRole,
    updateRole,
    assignManager,
    viewManEmp,
    deleteEmployee,
    deleteDepartment,
    deleteRole,
    viewBudget
};