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
    connection.query("SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d on r.department_id = d.id ORDER BY e.id;", function (err, data) {
        if (err) throw err;
        if (data.length === 0) {
            console.log("There are no employees");
        };
        for (let i = 0; i < data.length; i++) {
            console.log("ID: " + data[i].id
                + " || Name: " + data[i].first_name + " " + data[i].last_name
                + " || Role: " + data[i].title
                + " || Salary: " + data[i].salary
                + " || Department: " + data[i].name);
        };
        manageEmployee();
    });
};

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, result) {
        if (err) throw err;
        let choices = [];
        for (let i = 0; i < result.length; i++) {
            choices.push(result[i].name);
        };
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "What department would you like to view?",
            choices: choices
        }).then(function (info) {
            let query = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d on r.department_id = d.id WHERE d.name = ?;"
            connection.query(query, info.department, function (err, data) {
                if (err) throw err;
                if (data.length === 0) {
                    console.log("There are no departments");
                }
                for (let i = 0; i < data.length; i++) {
                    console.log("ID: " + data[i].id
                        + " || Name: " + data[i].first_name + " " + data[i].last_name
                        + " || Role: " + data[i].title
                        + " || Salary: " + data[i].salary
                        + " || Department: " + data[i].name);
                }
                manageEmployee();
            });
        });
    });
};

function viewRoles() {
    connection.query("SELECT * FROM role", function (err, result) {
        if (err) throw err;
        let choices = [];
        for (let i = 0; i < result.length; i++) {
            choices.push(result[i].title);
        };
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "What role would you like to view?",
            choices: choices
        }).then(function (info) {
            let query = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name FROM employee AS e INNER JOIN role AS r ON e.role_id = r.id INNER JOIN department AS d on r.department_id = d.id WHERE r.title = ? ORDER BY e.id;"
            connection.query(query, info.role, function (err, data) {
                if (err) throw err;
                if (data.length === 0) {
                    console.log("There are no roles");
                };
                for (let i = 0; i < data.length; i++) {
                    console.log("ID: " + data[i].id
                        + " || Name: " + data[i].first_name + " " + data[i].last_name
                        + " || Role: " + data[i].title
                        + " || Salary: " + data[i].salary
                        + " || Department: " + data[i].name);
                };
                manageEmployee();
            });
        });
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
    connection.query("SELECT * FROM role;", function (err, role) {
        if (err) throw err;
        let roles = [];
        for (let i = 0; i < role.length; i++) {
            roles.push(role[i].title);
        };
        connection.query("SELECT * FROM employee;", function (err, employee) {
            if (err) throw err;
            let employees = [];
            for (let i = 0; i < employee.length; i++) {
                employees.push(employee[i].first_name + " " + employee[i].last_name);
            };
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employees
                },
                {
                    name: "role",
                    type: "list",
                    message: "What is their new role?",
                    choices: roles
                }
            ]).then(function (data) {
                console.log("you made it!")
            });
        });
    });
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