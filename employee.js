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
        let choices = result.map((department)=> department);
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
                    console.log("There are no employees in this department");
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
    connection.query("SELECT * FROM role;", function (err, result) {
        if (err) throw err;
        let choices = result.map((role) => {return role.title});
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
                    console.log("There are no employees in this role");
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
        let choices = result.map((role) => {return role.title});
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
        let choices = result.map((department) => {return department.name});
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
    connection.query("SELECT * FROM role;", function (err, result) {
        if (err) throw err;
        let roles = result.map((role) => {return role.title})
        connection.query("SELECT e.first_name, e.last_name, e.role_id, r.title, r.id FROM employee AS e INNER JOIN role as r ON e.role_id = r.id;", function (err, info) {
            if (err) throw err;
            let employees = info.map((employee) => {return employee.first_name + " " + employee.last_name});
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
                for (let i = 0; i < employees.length; i++) {
                    if (data.employee === employees[i] && data.role === info[i].title) {
                        console.log("That is already this employee's role.");
                        return updateRole();
                    };
                };
                let newID = "";
                let name = data.employee.split(" ");
                let firstName = name[0];
                let lastName = name[1];
                for (let i = 0; i < result.length; i++) {
                    if (result[i].title === data.role) {
                        newID = result[i].id;
                    }
                };
                let query = "UPDATE employee SET employee.role_id = ? WHERE employee.first_name = ? AND employee.last_name = ?;";
                connection.query(query, [newID, firstName, lastName]);
                manageEmployee();
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
    connection.query("SELECT * FROM employee;", function (err, data) {
        if (err) throw err;
        let employees = data.map((employee) => {return employee.first_name + " " + employee.last_name})
        inquirer.prompt({
            name: "deleted",
            type: "list",
            message: "Which employee would you like to delete?",
            choices: employees
        }).then(function(result) {
            let name = result.deleted.split(" ");
                let firstName = name[0];
                let lastName = name[1];
            let query = "DELETE FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;";
            connection.query(query, [firstName, lastName]);
            manageEmployee();
        });
    });
};

function deleteDepartment() {
    connection.query("SELECT * FROM department", function(err, data) {
        if (err) throw err;
        let departments = data.map((department) => {return department.name});
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department woudl you like to delete?",
            choices: departments
        }).then(function(result) {
            let query = "DELETE FROM department WHERE department.name = ?;";
            connection.query(query, [result.department]);
            manageEmployee()
        });
    });
};

function deleteRole() {
    connection.query("SELECT * FROM role", function(err, data) {
        if (err) throw err;
        let roles = data.map(function(role) {return role.title});
        inquirer.prompt({
            name: "role",
            type: "list",
            message: "Which role would you like to delete?",
            choices: roles
        }).then(function(result) {
            let query = "DELETE FROM role WHERE role.title = ?;";
            connection.query(query, [result.role]);
            manageEmployee();
        });
    });
};

function viewBudget() {
    connection.query("SELECT * FROM department", function(err, result){
        if (err) throw err;
        let departments = result.map(function(department) {return department.name});
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department's utilized budget would you like to view?",
            choices: departments
        }).then(function(info) {
            connection.query("SELECT r.title, r.salary, d.name, e.first_name, e.last_name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id INNER JOIN employee as e ON e.role_id = r.id WHERE d.name = ?;", [info.department], function(err, data) {
                if (err) throw err;
                let salaries = data.map(function(employee) {return employee.salary});
                let budget = salaries.reduce(function(a, b) {return a + b});
                console.log("The " + info.department + " department has used $" + budget + ".");
                manageEmployee();
            });
        });
    });
};