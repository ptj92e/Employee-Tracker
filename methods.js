let inquirer = require("inquirer");
let mysql = require("mysql");
let employee = require("./employee");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "",

    // Your password
    password: "",
    database: "employeeDB"
});

function viewEmployees() {
    console.log("you did it");
    employee.manageEmployee();
};

function viewDepartments() {
    let query = "SELECT * FROM department;"
    connection.query(query, function(err, data) {
        if (data.length === 0) {
            console.log("There are no departments");
        }
        for (let i = 0; i < data.length; i++) {
            console.log("Department: " + data[i].name + " || ID: " + data[i].id)
        }
        employee.manageEmployee();
    });
};

function viewRoles() {
    let query = "SELECT * FROM role;"
    connection.query(query, function(err, data) {
        if (data.length === 0) {
            console.log("There are no departments");
        }
        for (let i = 0; i < data.length; i++) {
            console.log("Title: " + data[i].title + " || Salary: " + data[i].salary + " || Role ID: " + data[i].id + " || Department ID: " + data[i].department_id)
        }
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

    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        let choices = [];
        for (let i = 0; i < result.length; i++) {
            choices.push(result[i].name);
        };
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "What role would you like to add?"
            },
            {
                name: "salary",
                type: "input",
                message: "How much is the salary for this job?"
            },
            {
                name: "department",
                type: "list",
                message: "What department does this employee belong to?",
                choices: choices
            }
        ]).then(function (data) {
            console.log(data.name);
            let id = "";
            for (let i = 0; i < result.length; i++) {
                if (data.department === result[i].name) {
                    id = parseInt(result[i].id);
                }
            }
            let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(query, [data.title, parseInt(data.salary), id]);
            employee.manageEmployee();
        });
    });
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