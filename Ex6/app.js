const express = require('express');
const app = express();
const port = 3000;

// //import routers
// const articleRouter = require('./routes/articleRouter');

// // app.use('/api/articles', articleRouter);

const articles = require('./articles');
const videos = require('./videos');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.get('/articles', (req, res) => {
    res.status(200).json(articles);
});

app.get('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const article = articles.find(article => article.id === id);
    if (!article) return res.status(404).send('Article not found');
    res.status(200).json(article);
});

app.post('/articles', (req, res) => {
    const newArticle = {
        id: articles.length > 0 ? articles[articles.length - 1].id + 1 : 1, 
        title: req.body.title,
        date: req.body.date,
        text: req.body.text
    };
    articles.push(newArticle);
    res.status(201).json(newArticle);
});

app.put('/articles/:id', (req, res) => {
    const index = articles.findIndex(article => article.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Article not found');
    
    articles[index] = {
        ...articles[index],
        ...req.body
    };
    res.json(articles[index]);
});

app.delete('/articles/:id', (req, res) => {
    const index = articles.findIndex(article => article.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Article not found');
    
    const deletedArticle = articles.splice(index, 1);
    res.status(204).json(deletedArticle);
});



app.get('/videos', (req, res) => {
    res.status(200).json(videos);
});

app.get('/videos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const video = videos.find(video => video.id === id);
    if (!video) return res.status(404).send('Video not found');
    res.status(200).json(video);
});

app.post('/videos', (req, res) => {
    const newVideo = {
        id: videos.length > 0 ? videos[videos.length - 1].id + 1 : 1,
        title: req.body.title,
        date: req.body.date,
        author: req.body.author,
        video: req.body.video,
        content: req.body.content
    };
    videos.push(newVideo);
    res.status(201).json(newVideo);
});

app.put('/videos/:id', (req, res) => {
    const index = videos.findIndex(video => video.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Video not found');
    
    videos[index] = {
        ...videos[index],
        ...req.body
    };
    res.json(videos[index]);
});

app.delete('/videos/:id', (req, res) => {
    const index = videos.findIndex(video => video.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).send('Video not found');
    
    const deletedVideo = videos.splice(index, 1);
    res.status(204).json(deletedVideo);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;