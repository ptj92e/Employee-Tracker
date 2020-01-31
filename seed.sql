INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO department (name)
VALUES ("Development");

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO role (title, salary, department_id)
VALUES ("Paralegal", 250000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 350000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Back End Developer", 125000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Front End Developer", 125000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Associate", 60000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Manager", 80000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Product Creation", 175000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Testing", 150000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Phillip", "Jones", 4, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Stephen", "Webb", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kogan", "Pack", 4, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Cassidy", "Fortner", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Dylan", "Coffey", 1, 6);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Jamie", "Cook", 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Zeela", "Vendl-Jones", 5, 8);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Nova", "Vendl-Jones", 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Wayne", "Collier", 7, 10);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Rob", "Suttles", 8);