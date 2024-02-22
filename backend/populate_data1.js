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
db.sync({ force: true })//.then(() => {

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

//});

// NOTE: To keep this particular example simple, we don't close the database
// connection before exiting. See populate_data2.js for an example which
// exits gracefully.
