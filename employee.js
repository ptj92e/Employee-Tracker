//Requiring mysql and inquirer for the app to work
let mysql = require("mysql");
let inquirer = require("inquirer");
//This establishes a connection to the database
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
//This sets up the connection and runs the manageEmployee function
connection.connect(function (err) {
    if (err) throw err;
    manageEmployee();
});
//This function is a one prompt the includes a switch statement to point the application in the direction of which method of run next
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
//This function pulls all of the information from the mySQL database through a series of inner joins and a left join. Once the information has been pulled, I used console.table to create a clear table of all of the information gathered
function viewEmployees() {
    connection.query("SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title, r.salary, d.name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON m.id = e.manager_id;", function (err, data) {
        if (err) throw err;
        if (data.length === 0) {
            console.log("There are no employees");
        };
        console.table(data);
        manageEmployee();
    });
};
//This function functions similarly to the viewEmployees but there is an extra step. The initial connection pulls the names of the departments from the database and turns them into a list of answer choices. From there, all of the employees with the department of the user's choice are put into a table to be viewed. 
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
            let query = "SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title, r.salary, d.name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON m.id = e.manager_id WHERE d.name = ?;"
            connection.query(query, info.department, function (err, data) {
                if (err) throw err;
                if (data.length === 0) {
                    console.log("There are no employees in this department");
                }
                console.table(data);
                manageEmployee();
            });
        });
    });
};
//This function does the same as the viewDepartments function except with the roles
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
            let query = "SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title, r.salary, d.name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON m.id = e.manager_id WHERE r.title = ?;"
            connection.query(query, info.role, function (err, data) {
                if (err) throw err;
                if (data.length === 0) {
                    console.log("There are no employees in this role");
                };
                console.table(data);
                manageEmployee();
            });
        });
    });
};
//This funciton uses a series of inquirer promts to ask the user for the employee's name and to choose their role from a list of roles.
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
            //This inputs the role's id into the query so the employee can be created into the database
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
//This function works similarly to the addEmployee function  and only takes in the name of the department as a parameter
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
//This function adds a role but asks for a the title of the role, the salary of that role, and the department which it belongs to. 
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
            //This anonymous function turns the department's id into a variable and is then passed into the query to create the new role. 
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
//This function uses two different connections to pull a list of employees and a list of roles. Those are turned into answer choices for the inquirer prompt. 
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
                //This anonymous function determines whether or not the role selected is the current role of the rmployee. If it is, the user is alerted and the function starts over. If it is not, the employee's role is updated
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
//This function assigns a manager to an employee. The first connection gathers a list of employees to use as answer choices. 
function assignManager() {
    connection.query("SELECT * FROM employee;", function(err, data) {
        if (err) throw err;
        let employees = data.map(function(employee) {return employee.first_name + " " + employee.last_name});
        inquirer.prompt([
            {
                name: "employee",
                type: "list",
                message: "Which employee do you want to assign a manager?",
                choices: employees
            },
            {
                name: "manager",
                type: "list",
                message: "Who is this employee's manager?",
                choices: employees
            }
        ]).then(function(result) {
            //This section of the application checks the name of the employee and the manager selected. For the manager selected, it takes their id and sets it as the manager id for the employee who is being assigned a manager
            let employeeName = result.employee.split(" ");
            let employeeFirst = employeeName[0];
            let employeeLast = employeeName[1];
            let managerName = result.manager.split(" ");
            let managerFirst = managerName[0];
            let managerLast = managerName[1];
            let managerID = "";
            for (let i = 0; i < data.length; i++) {
                if (managerFirst === data[i].first_name && managerLast === data[i].last_name) {
                    managerID = data[i].id;
                }
            }
            let query = "UPDATE employee SET employee.manager_id = ? WHERE employee.first_name = ? AND employee.last_name = ?;"
            connection.query(query, [managerID, employeeFirst, employeeLast]);
            manageEmployee();
        });
    });
};
//This connection uses two inner joins and a left join to retrieve information based off of which manager whas selected. It populates all of the employees for that manager from the choices
function viewManEmp() {
    connection.query("SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) AS employee, e.manager_id, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e LEFT JOIN employee AS m ON m.id = e.manager_id", function(err, data) {
        if (err) throw err;
        let managers = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i].manager_id !== null) {
                managers.push(data[i].manager);
            };
        };
        inquirer.prompt({
            name: "manager",
            type: "list",
            message: "Which manager's employees do you want to view?",
            choices: managers
        }).then(function(result) {
            let query = "SELECT CONCAT(e.first_name, ' ', e.last_name) AS employee, r.title, r.salary, d.name, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee AS e INNER JOIN role AS r ON r.id = e.role_id INNER JOIN department AS d ON d.id = r.department_id LEFT JOIN employee AS m ON m.id = e.manager_id WHERE e.manager_id = ?;"
            let manID = "";
            for (let i = 0; i < data.length; i++) {
                if (data[i].employee === result.manager) {
                    manID = data[i].id;
                }
            }
            connection.query(query, manID, function(err, info) {
                if (err) throw err;
                console.table(info);
                manageEmployee();
            });
        });
    });
};
//This function deletes an employee from the database based off of which choice was selected
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
//This functions similarly to deleteEmployee except when a department is deleted, it cascades and deletes each role and employee currently assigned to the department which was deleted
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
//This functions similarly to delete employee but it also deletes each employee that shares the role that is selected
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
//This function displays the used budget of the department that was selected
function viewBudget() {
    //This creates the answer choices
    connection.query("SELECT * FROM department", function(err, result){
        if (err) throw err;
        let departments = result.map(function(department) {return department.name});
        inquirer.prompt({
            name: "department",
            type: "list",
            message: "Which department's utilized budget would you like to view?",
            choices: departments
        }).then(function(info) {
            //This query pulls salary information from the database
            connection.query("SELECT r.title, r.salary, d.name, e.first_name, e.last_name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id INNER JOIN employee as e ON e.role_id = r.id WHERE d.name = ?;", [info.department], function(err, data) {
                if (err) throw err;
                //The salary information is then put into an array
                let salaries = data.map(function(employee) {return employee.salary});
                //The reduce method takes the array and adds index 0, and 1 of the array together until there is only one value in the array. This is saved into a variable called budget
                let budget = salaries.reduce(function(a, b) {return a + b});
                console.log("The " + info.department + " department has used $" + budget + ".");
                manageEmployee();
            });
        });
    });
};