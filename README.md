# Employee-Tracker

This project was an exercise in manipulating mySQL databases. It uses a series of inquirer prompts to submit queries to mySQL to either create, update, replace, or delete information from databases. 

### Login

When trying out the code, I have provided a "user" and "password" portion to the connection where you can easily input your information for your mySQL login. This can be found on lines 11 and 14 of the employee.js page.

## Inquirer
For this app to function, Inquirer is used to prompt the user with what they would like to do. From there, they have a choice as to what answer to submit and based off of that answer, a method is run with its own inquirer prompts to manipulate the mySQL database. 

## mySQL 

mySQL was the database system I used for this app. The inquirer prompts use methods to send queries to mySQL which allow the user to view employee information, create new employee information, update employee information, or delete employee information. This is all done by using a series of inner joins to join 3 tables to each other and even a left join to join the employee table to itself to retrieve manager information. 