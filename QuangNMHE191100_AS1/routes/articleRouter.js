const express = require('express');
const fs = require('fs');
const filePath = './data.json'

const articleRouter = express.Router();
articleRouter.use(express.json());


const readData = async () => {
    const data = await fs.promises.readFile(filePath, 'utf8'); 
    return JSON.parse(data); 
};

    const writeData = async (data) => {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2)); 
};

articleRouter.route('/')
    .get(async (req, res) => {
        try {
            const articles = await readData(); 
            res.status(200).json(articles.articles); 
        } catch (err) {
            res.status(500).json({ message: err.message }); 
        }
    })


    .post(async (req, res) => {
        try {
            const read = await readData();
            const articles= read.articles
            const newArticle = {
                id: articles.length > 0 ? articles[articles.length - 1].id + 1 : 1, 
                title: req.body.title, 
                date: req.body.date, 
                content: req.body.content,
                author: req.body.author
            };
            articles.push(newArticle); 
            
            await writeData(read); 
            
            res.status(201).json(newArticle); 
        } catch (err) {
            res.status(400).json({ message: err.message }); 
        }
    });


articleRouter.route('/:id')
    .get(async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const read = await readData(); 
            const articles =read.articles;
        res.status(200).json(articles.find(s => s.id === id));     
        } catch (err) {
            res.status(404).json({ message: err.message }); 
        }
    })

    .put(async (req, res) => {
        try {
            const read = await readData();
            const articles = read.articles;
            const index = articles.findIndex(article => article.id === parseInt(req.params.id)); 
            
            if (index === -1) return res.status(404).send('Article not found'); 

            articles[index] = { ...articles[index], ...req.body }; 
            
            await writeData(read); 
            
            res.status(200).json(articles[index]); 
        } catch (err) {
            res.status(404).json(err.message)
        }
    })

        .delete(async (req, res) => {
        try {
            const read = await readData();
            const articles = read.articles;
            const index = articles.findIndex(article => article.id === parseInt(req.params.id)); 
            
            if (index === -1) return res.status(404).send('Article not found'); 

            const deletedArticle = articles.splice(index, 1); 
            
            await writeData(read); 
            
            res.status(200).json(deletedArticle); 
        } catch (err) {
            res.status(404).json({ message: err.message }); 
        }
    });

articleRouter.route('/:id/comments')
 .get(async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const read = await readData(); 
            const articles = read.articles;
            const comments = read.comments;

            if (!articles.some(s => s.id === id)) {
                return res.status(404).json({ message: 'Article not found' });
            }

            res.status(200).json(comments.filter(s => s.articleId === id)); 
        } catch (err) {
            res.status(404).json({ message: err.message }); 
        }
    })



module.exports = articleRouter;
    

