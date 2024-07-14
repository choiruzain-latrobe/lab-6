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
