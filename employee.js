let mysql = require("mysql");
let inquirer = require("inquirer");

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
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "Add a new employee":
                addEmployee();
                break;
            case "Add a new department":
                addDepartment();
                break;
            case "Add a new role":
                addRole();
                break;
            case "Update an employee's role":
                updateRole();
                break;
            case "Assign an employee a manager":
                assignManager();
                break;
            case "View all manager's employees":
                viewManEmp();
                break;
            case "Delete an employee":
                deleteEmployee();
                break;
            case "Delete a department":
                deleteDepartment();
                break;
            case "Delete a role":
                deleteRole();
                break;
            case "View a department's utilized budget":
                viewBudget();
                break;
        }
    });
};

function viewEmployees() {
    console.log("you did it");
    manageEmployee();
};

function viewDepartments() {
    let query = "SELECT * FROM department;"
    connection.query(query, function (err, data) {
        if (data.length === 0) {
            console.log("There are no departments");
        }
        for (let i = 0; i < data.length; i++) {
            console.log("Department: " + data[i].name + " || ID: " + data[i].id)
        }
        manageEmployee();
    });
};

function viewRoles() {
    let query = "SELECT * FROM role;"
    connection.query(query, function (err, data) {
        if (data.length === 0) {
            console.log("There are no roles");
        }
        for (let i = 0; i < data.length; i++) {
            console.log("Title: " + data[i].title + " || Salary: " + data[i].salary + " || Role ID: " + data[i].id + " || Department ID: " + data[i].department_id)
        }
        manageEmployee();
    });
};

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        let choices = [];
        for (let i = 0; i < result.length; i++) {
            choices.push(result[i].title);
        };
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"
            },
            {
                name: "role",
                type: "list",
                message: "What role does this employee have?",
                choices: choices
            }
        ]).then(function (data) {

            let roleID = "";
            for (let i = 0; i < result.length; i++) {
                if (data.role === result[i].title) {
                    roleID = parseInt(result[i].id);
                }
            }
            let query = "INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?)";
            connection.query(query, [data.firstName, data.lastName, roleID]);
            manageEmployee();
        });
    });
};

function addDepartment() {
    inquirer.prompt({
        name: "name",
        type: "input",
        message: "What department would you like to add?"
    }).then(function (data) {
        let query = "INSERT INTO department (name) VALUES (?)";
        connection.query(query, data.name);
        manageEmployee();
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
            let departmentID = "";
            for (let i = 0; i < result.length; i++) {
                if (data.department === result[i].name) {
                    departmentID = parseInt(result[i].id);
                }
            }
            let query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
            connection.query(query, [data.title, parseInt(data.salary), departmentID]);
            manageEmployee();
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