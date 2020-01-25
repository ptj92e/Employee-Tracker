let mysql = require("mysql");
let inquirer = require("inquirer");
let methods = require("./methods");

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

connection.connect(function (err) {
    if (err) throw err;
    manageEmployee();
});

function manageEmployee() {
    inquirer.prompt({
        name: "selection",
        type: "rawlist",
        message: "What would you like to do?",
        choices: [
            "View all employees",
            "View all departments",
            "View all roles",
            "Add a new employee",
            "Add a new department",
            "Add a new role",
            "Update an employee's role",
            "Assign an employee a manager",
            "View all manager's employees",
            "Delete an employee",
            "Delete a department",
            "Delete a role",
            "View a department's utilized budget"
        ]
    }).then(function (answer) {
        switch (answer.selection) {
            case "View all employees":
                methods.viewEmployees();
                break;
            case "View all departments":
                methods.viewDepartments();
                break;
            case "View all roles":
                methods.viewRoles();
                break;
            case "Add a new employee":
                methods.addEmployee();
                break;
            case "Add a new department":
                methods.addDepartment();
                break;
            case "Add a new role":
                methods.addRole();
                break;
            case "Update an employee's role":
                methods.updateRole();
                break;
            case "Assign an employee a manager":
                methods.assignManager();
                break;
            case "View all manager's employees":
                methods.viewManEmp();
                break;
            case "Delete an employee":
                methods.deleteEmployee();
                break;
            case "Delete a department":
                methods.deleteDepartment();
                break;
            case "Delete a role":
                methods.deleteRole();
                break;
            case "View a department's utilized budget":
                methods.viewBudget();
                break;
        }
    });
};

module.exports = {manageEmployee};