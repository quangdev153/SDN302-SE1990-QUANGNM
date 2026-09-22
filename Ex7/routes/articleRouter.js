const express = require('express');
const articleRouter = express.Router();

articleRouter.use(express.json());
articleRouter.use(express.urlencoded({extended:true}));

articleRouter.route('/')

    .get(async (req,res)=>{
        try{
            res.status(200).end("Will send all articles to you");
        } catch(err){
            res.status(500).json({error: err.message});
        }
    })

    .post(async (req,res)=>{
        try{
            res.status(201).json(`Will add the article:`+ req.body.title+` with details: `+ req.body.text+` and date: `+ req.body.date);
        } catch(err){
            res.status(400).json({error: err.message});
        }
    })

    .put(async (req,res) =>{
        try{
            res.status(403).json({error: "PUT operation not supported on /articles"});
        } catch(err){
            res.status(500).json({error: err.message});
        }
    })

    .delete(async (req,res)=>{
        try{
            res.status(200).end("Deleting all articles");
        } catch(err){
            res.status(500).json({error: err.message});
        }
    })



articleRouter.route('/:id')

    .get(async (req,res)=>{
    try{
        res.status(200).end("Will send details of the article: "+ req.params.id+ " to you");
    } catch(err){
        res.status(500).json({error: err.message});
    }
    })

    .post(async (req,res)=>{
        try{
            res.status(403).json({error: "POST operation not supported on /articles/"+ req.params.id});
        } catch(err){
            res.status(500).json({error: err.message});
        }
    })

    .put(async (req,res)=>{
        try{
            res.status(200).json(`Updating the article: `+ req.params.id+` with details: `+ req.body.title+` and text: `+ req.body.text+` and date: `+ req.body.date);
        } catch(err){
            res.status(500).json({error: err.message});
        }   
    })

    .delete(async (req,res)=>{
        try{
            res.status(200).end("Deleting article: "+ req.params.id);
        } catch(err){
            res.status(500).json({error: err.message});
        }
    })

module.exports = articleRouter;




