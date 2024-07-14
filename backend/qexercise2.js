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
