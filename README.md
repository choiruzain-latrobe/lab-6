# LAB 6 WALKTROUGH README MODE - SOLUTION

## Starting the Database

To start the database with Docker Compose and build the necessary images, run the following command:

```sh
docker compose up db --build
```
## Enter Container terminal

1. Start the new terminal
2. Run the docker container (lab-6-db), and run the following command:
```sh
docker exec -it lab-6-db bash
```

## Login to database inside the container
1. Inside the container shell, run the following commands:
```sh
mysql --user=$MYSQL_USER --password=$MYSQL_PASS development_db
```

or

```sh
mysql -u$MYSQL_USER -p$MYSQL_PASS development_db 
```

## Show the Table inside MySQL - MySQL Shell Commands

To show all tables in the current database, run the following command in the MySQL shell:

```sh
mysql> 
SHOW TABLES;
```

## Sequelize Configuration

### connect_db.js
```js
/**
 * connect_db.js
 * Requiring this file will connect to the database and return the
 * Sequelize database connection object.
 */

const Sequelize = require('sequelize');

const dbConfig = {
host: process.env.MYSQL_REMOTE_HOST,
port: process.env.MYSQL_REMOTE_PORT,
// here we are selecting mysql as the database type we will be using
dialect: 'mysql'
};

// Here we connect to the database
const db = new Sequelize(
'development_db',
process.env.MYSQL_USER,
process.env.MYSQL_PASS,
dbConfig);

module.exports = db;

```

### mysql.env
```js
MYSQL_USER=admin
MYSQL_PASS=af84de4d1b8a247e8ef9925d273d3ec549782c76be096217
MYSQL_REMOTE_HOST=db
MYSQL_REMOTE_PORT=3306
```

### docker-compose.yml
```yaml
version: "3.8"

name: lab-6

services:
  backend:
    container_name: lab-6-backend
    build: backend
    environment:
      - NODE_ENV=development
    volumes:
      - "./backend:/app"
    env_file:
      - ./env/mysql.env
    links:
      - db
  db:
    container_name: lab-6-db
    image: tutum/mysql:5.6
    environment:
      - ON_CREATE_DB=development_db
    env_file:
      - ./env/mysql.env
    volumes:
      - "db_data:/var/lib/mysql"

volumes:
  db_data:
    external: false

```

## Working with A single Table/Model Database
1. Edit the populate_data1.js, so that it becomes
```shell
const Sequelize = require('sequelize');
const db = require('./connect_db');

// Here we define a model called articles which has two attributes called title
// and content.
// This model correcponds to the "articles" table in the database.
const Article = db.define('articles', {
  title: Sequelize.STRING,
  // We make this TEXT since STRING can only hold 256 chars
  content: Sequelize.TEXT
});

// This sync call is when the table will be actually created in the database
// The force : true option DROPS the tables in the database before inserting
// the new table. So please do not use this in a real production system.
// It is good for learning but way too dangerous to use in real life.
//
// The then promise function call is really important since it waits for the
// sync function to finish executing before executing the create article method
// calls. Otherwise we will be trying to insert into the database before the
// tables have been created.
//
// Currently the then function is commented out. This does not work properly,
// and you will get an error message. Uncomment the then function here and the
// at end of the program (the closing braces) and see what happens.
db.sync({ force: true }).then(() => {

  // When creating a record the id attribute is automatically generated and put into the database.
  Article.create({
    title: 'War and Peace',
    content: 'A book about fighting and then making up.'
  });

  Article.create({
    title: 'Sequelize for dummies',
    content: 'Writing lots of cool javascript code that get turned into SQL.'
  });

  Article.create({
    title: 'I like tomatoes',
    content: 'The story about the adventures of a tomato lover.'
  });

  Article.create({
    title: 'PHP for dummies',
    content: 'Why PHP is so so so bad at backend stuff. Why you should use express node.'
  });

  Article.create({
    title: 'The lovely car',
    content: 'How a car changed his life forever.'
  });

});

// NOTE: To keep this particular example simple, we don't close the database
// connection before exiting. See populate_data2.js for an example which
// exits gracefully.
```
2. Start a new terminal and go into the backend/ directory and type the following in it:

```shell
docker compose run --rm backend node populate_data1.js
```

## Check the articles table
Now go to the MySQL terminal that you logged into earlier. Type the following command:

```shell
mysql>
SHOW TABLES;

and you will get an output as follows:

+--------------------------+
| Tables_in_development_db |
+--------------------------+
| articles                 |
+--------------------------+
1 row in set (0.01 sec)
```

You can check the table **articles**

```shell
mysql> DESCRIBE articles;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int(11)      | NO   | PRI | NULL    | auto_increment |
| title     | varchar(255) | YES  |     | NULL    |                |
| content   | text         | YES  |     | NULL    |                |
| createdAt | datetime     | NO   |     | NULL    |                |
| updatedAt | datetime     | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
5 rows in set (0.01 sec)
```
### Selecting the Data

```shell
mysql> select * from articles;
+----+-----------------------+----------------------------------------------------------------------------+---------------------+---------------------+
| id | title                 | content                                                                    | createdAt           | updatedAt           |
+----+-----------------------+----------------------------------------------------------------------------+---------------------+---------------------+
|  1 | PHP for dummies       | Why PHP is so so so bad at backend stuff. Why you should use express node. | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
|  2 | Sequelize for dummies | Writing lots of cool javascript code that get turned into SQL.             | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
|  3 | I like tomatoes       | The story about the adventures of a tomato lover.                          | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
|  4 | The lovely car        | How a car changed his life forever.                                        | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
|  5 | War and Peace         | A book about fighting and then making up.                                  | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
+----+-----------------------+----------------------------------------------------------------------------+---------------------+---------------------+
5 rows in set (0.01 sec)

```


### Run the queries (querying1.js)

Note **Run it in the main terminal**

```shell
lab-6 % docker compose run --rm backend node querying1.js
```


You will see an output similar to the following:
```shell
# DO NOT RUN THIS, JUST AN OUTPUT
[+] Creating 1/0
 ✔ Container lab-6-db  Running                                                                                                                                                                 0.0s 
[+] Building 6.0s (15/15) FINISHED                                                                                                                                             docker:desktop-linux
 => [backend internal] load .dockerignore                                                                                                                                                      0.0s
 => => transferring context: 2B                                                                                                                                                                0.0s
 => [backend internal] load build definition from Dockerfile                                                                                                                                   0.0s
 => => transferring dockerfile: 1.09kB                                                                                                                                                         0.0s
.........
.........
Executing (default): SELECT `id`, `title`, `content`, `createdAt`, `updatedAt` FROM `articles` AS `articles` WHERE `articles`.`id` > 3;
Executing (default): DELETE FROM `articles` WHERE `id` = 4
Executing (default): DELETE FROM `articles` WHERE `id` = 5
Executing (default): SELECT `id`, `title`, `content`, `createdAt`, `updatedAt` FROM `articles` AS `articles`;
# All articles after destroying
{
  id: 1,
  title: 'PHP for dummies',
  content: 'Why PHP is so so so bad at backend stuff. Why you should use express node.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}
{
  id: 2,
  title: 'Sequelize for dummies',
  content: 'Writing lots of cool javascript code that get turned into SQL.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}
{
  id: 3,
  title: 'I like tomatoes',
  content: 'The story about the adventures of a tomato lover.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}
```

###

You can confirm that only 3 rows remain in the articles table (no longer five). This is because the query (Q4) in the **querying** below finds all articles with an ID greater than 3 and deletes them.

To verify, you can open the **MySQL shell** and **run the following command**:

```shell
mysql> select * from articles;
+----+-----------------------+----------------------------------------------------------------------------+---------------------+---------------------+
| id | title                 | content                                                                    | createdAt           | updatedAt           |
+----+-----------------------+----------------------------------------------------------------------------+---------------------+---------------------+
|  1 | PHP for dummies       | Why PHP is so so so bad at backend stuff. Why you should use express node. | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
|  2 | Sequelize for dummies | Writing lots of cool javascript code that get turned into SQL.             | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
|  3 | I like tomatoes       | The story about the adventures of a tomato lover.                          | 2024-07-14 07:26:19 | 2024-07-14 07:26:19 |
+----+-----------------------+----------------------------------------------------------------------------+---------------------+---------------------+
3 rows in set (0.01 sec)
```

# EXERCISE

## Q1
Print out the contents of articles whose id is either 1 or 3. 
Hint: use the [Op.in] operator, like id:{[Op.in]:[1,3]}.

Create a file (**e.g. qexercise1.js**). Copy and paste the following
```shell
# SOLUTION
const Sequelize = require('sequelize');
const db = require('./connect_db');
const { Op } = require("sequelize");

// Tell Sequelize about the 'articles' table.
const Article = db.define('articles', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT
});

// Now we will execute a bunch of queries. Notice that we are forcing the
// queries to execute in order by chaining with `then`.

// Q1: This query finds the article with id 1 or 3
// you can use the findAll method with a where clause in Sequelize.


// *** TODO: Insert code here ***

// FIRST WAY

Article.findAll({
    where: {
        id: [1, 3]
    }
})
    .then(articles => {
        articles.forEach(article => {
            console.log(`# Article with id=${article.id} first way`);
            console.log(article.dataValues);
            console.log();
        });
    })


    // SECOND WAY
    .then(() =>
        Article.findAll({
            where: {
                id: {
                    [Op.in]: [1,3]
                }
            }
        })

    )

    .then(articles => {
        articles.forEach(article => {

            console.log(`# Article with id=${article.id} second way`);
            console.log(article.dataValues);
            console.log();
        });
    })
    .catch(err => {
        console.error('Error:', err);
    })
    .catch(console.error).then(() => db.close());
```

Run the following command

```shell
docker compose run --rm backend node qexercise1.js
```

See the output as follows:
```shell

[+] Creating 1/0
 ✔ Container lab-6-db  Running                                                                                                                                                                                                                                                                            0.0s 
(node:7) [SEQUELIZE0006] DeprecationWarning: This database engine version is not supported, please update your database server. More information https://github.com/sequelize/sequelize/blob/main/ENGINE.md
(Use `node --trace-deprecation ...` to show where the warning was created)
Executing (default): SELECT `id`, `title`, `content`, `createdAt`, `updatedAt` FROM `articles` AS `articles` WHERE `articles`.`id` IN (1, 3);
# Article with id=1 first way
{
  id: 1,
  title: 'PHP for dummies',
  content: 'Why PHP is so so so bad at backend stuff. Why you should use express node.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}

# Article with id=3 first way
{
  id: 3,
  title: 'I like tomatoes',
  content: 'The story about the adventures of a tomato lover.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}

Executing (default): SELECT `id`, `title`, `content`, `createdAt`, `updatedAt` FROM `articles` AS `articles` WHERE `articles`.`id` IN (1, 3);
# Article with id=1 second way
{
  id: 1,
  title: 'PHP for dummies',
  content: 'Why PHP is so so so bad at backend stuff. Why you should use express node.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}

# Article with id=3 second way
{
  id: 3,
  title: 'I like tomatoes',
  content: 'The story about the adventures of a tomato lover.',
  createdAt: 2024-07-14T07:26:19.000Z,
  updatedAt: 2024-07-14T07:26:19.000Z
}

```

## SOLUTION Q2

```shell
const Sequelize = require('sequelize');
const db = require('./connect_db');
const { Op } = require("sequelize");

// Tell Sequelize about the 'articles' table.
		const Article = db.define('articles', {
		  title: Sequelize.STRING,
			content: Sequelize.TEXT
		});


// FIRST WAY

Article.findAll()
	.then(articles => {
		articles.forEach(article => {
			console.log(`# Article with id=${article.id} main`);
			console.log(article.dataValues);
			console.log();
		});
	})


// SECOND WAY
.then(() =>
	Article.findAll({
		where: {
			id: {
				[Op.in]: [2]
			}
		}
	})

)
	.then(articles => {
		articles.forEach(article => {

			console.log(`# Article with id=${article.id} third`);
			console.log(article.dataValues);
			console.log();
		});
	})
	.catch(err => {
		console.error('Error:', err);
	})


	// *** TODO: Change something Exercise 2 ***


	.then(() =>
		Article.findOne({ where: { id: 2 } })
	)
	.then(article => {
		if (article) {
			return article.update({ content: "Sequelize is the worst ORM ever!" });
		} else {
			console.log('Article not found');
		}
	})
	.then(updatedArticle => {
		if (updatedArticle) {
			console.log('# Updated Article');
			console.log(updatedArticle.dataValues);
			console.log();
		}
	})
	.catch(err => {
		console.error('Error:', err);
	})

.catch(console.error).then(() => db.close());
```

## SOLUTION Q3
```shell
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

```
## SOLUTION Q4
```shell
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


```
## SOLUTION Q5
```shell
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
```