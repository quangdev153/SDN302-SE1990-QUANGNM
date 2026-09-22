const express = require('express');
const fs = require('fs');
const filePath = './data.json'

const commentRouter = express.Router();
commentRouter.use(express.json());



const readData = async () => {
    const data = await fs.promises.readFile(filePath, 'utf8'); 
    return JSON.parse(data); 
};

    const writeData = async (data) => {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2)); 
};

commentRouter.route('/')
    .get(async (req, res) => {
        try {
            const comment = await readData(); 
            res.status(200).json(articles.comments); 
        } catch (err) {
            res.status(500).json({ message: err.message }); 
        }
    })


    .post(async (req, res) => {
        try {
            const read = await readData();
            const comments= read.comments
            const articles = read.articles
            if(!(articles.filter(s => s.id === parseInt(req.body.articleId)))){
                return res.status(404).json({ message: err.message });
            }
            const newComment = {
                id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1, 
                articleId: req.body.articleId, 
                date: req.body.date, 
                content: req.body.content,
                author: req.body.author
            };
            comments.push(newComment); 
            
            await writeData(comments); 
            
            res.status(201).json(newComment); 
        } catch (err) {
            res.status(400).json({ message: err.message }); 
        }
    });


commentRouter.route('/:id')
    .get(async (req, res) => {
        try {
            const id = parseInt(req.params.id)
            const read = await readData(); 
            const comment =read.comments;
            res.status(200).json(comment.filter(s => s.id === id)); 
        } catch (err) {
            res.status(404).json({ message: err.message }); 
        }
    })

    .put(async (req, res) => {
        try {
            const read = await readData();
            const comments = read.comments;
            const index = comments.findIndex(comment => comment.id === parseInt(req.params.id)); 
            
            if (index === -1) return res.status(404).send('Comment not found'); 

            comments[index] = { ...comments[index], ...req.body }; 
            
            await writeData(comments); 
            
            res.status(200).json(comments[index]); 
        } catch (err) {
            res.status(404).json(err.message)
        }
    })

        .delete(async (req, res) => {
        try {
            const read = await readData();
            const comments = read.comments;
            const index = comments.findIndex(comment => comment.id === parseInt(req.params.id)); 
            
            if (index === -1) return res.status(404).send('Comment not found'); 

            const deletedArticle = comments.splice(index, 1); 
            
            await writeData(comments); 
            
            res.status(200).json(deletedArticle); 
        } catch (err) {
            res.status(404).json({ message: err.message }); 
        }
    });

    module.exports=commentRouter;

    
    

