const Sequelize = require('sequelize');
const db = require('./connect_db');
const { Op } = require("sequelize");

// *** Find the name of the company that "Peter Rabbit" works for by searching for the name "Peter Rabbit" in the employees table.  ***
// Tell Sequelize about the 'employees' table.
const Employee = db.define('employees', {
	name: Sequelize.STRING,
	age: Sequelize.STRING
});

db.sync()
	.then(() => {
		return Employee.findAll();
	})
	.then(employees => {
		employees.forEach(employee => {
			console.log(`# Employee with id=${employee.id} main ==> to retrieve all`);
			console.log(employee.dataValues);
			console.log();
		});

		return Employee.findOne({
			where: {
				name: {
					[Op.in]: ['Peter Rabbit']
				}
			}
		});
	})
	.then(employee => {
		if (employee) {
			console.log(`# Employee with id=${employee.id} to retrieve Peter Rabblt`);
			console.log(employee.dataValues);
			console.log();
		} else {
			console.log('Employee not found');
		}
	})
	.catch(err => {
		console.error('Error:', err);
	})


.catch(console.error).then(() => db.close());
