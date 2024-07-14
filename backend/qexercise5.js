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

// Synchronize the models with the database
db.sync({ force: false }).then(async () => {
	try {
		// Create a new employee and associate with company id=1
		const newEmployee = await Employee.create({
			name: 'John Doe',
			age: '30',
			companyId: 1
		});
		console.log('New employee added:', newEmployee);
	} catch (error) {
		console.error('Error adding new employee:', error);
	}
});
