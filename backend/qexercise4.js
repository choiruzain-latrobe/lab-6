// Find the company with the highest profit and list its employees.


// *** Find the name of the company that "Peter Rabbit" works for by searching for the name "Peter Rabbit" in the employees table.  ***
// Tell Sequelize about the 'employees' table.
const Sequelize = require('sequelize');
const db = require('./connect_db');
const { Op } = require("sequelize");

// Define the Company model
const Company = db.define('companies', {
	name: Sequelize.STRING,
	profit: Sequelize.FLOAT
});

// Define the Employee model
const Employee = db.define('employees', {
	name: Sequelize.STRING,
	age: Sequelize.STRING
});

// Define the Article model
const Article = db.define('articles', {
	title: Sequelize.STRING,
	content: Sequelize.TEXT
});

// Set up the associations
Employee.belongsTo(Company);
Company.hasMany(Employee);

// Sync the models with the database
db.sync()
	.then(() => {
		// Find the company with the highest profit
		return Company.findOne({
			order: [['profit', 'DESC']]
		});
	})
	.then(company => {
		if (!company) {
			throw new Error('No company found');
		}

		console.log(`Company with the highest profit: ${company.name} (Profit: ${company.profit})`);

		// Retrieve the employees of that company
		return Employee.findAll({
			where: {
				companyId: company.id
			}
		});
	})
	.then(employees => {
		if (employees.length === 0) {
			console.log('No employees found for this company.');
		} else {
			console.log(`Employees of the company:`);
			employees.forEach(employee => {
				console.log(`# Employee with id=${employee.id}, name=${employee.name}, age=${employee.age}`);
			});
		}
	})
	.catch(err => {
		console.error('Error:', err);
	})



	.catch(console.error).then(() => db.close());

