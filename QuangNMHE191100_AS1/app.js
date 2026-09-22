const express = require('express');
const app = express();
const port = 3002;

//import routers
const articleRouter = require('./routes/articleRouter');
const commentRouter = require('./routes/commentRouter');

app.use('/articles', articleRouter);
app.use('/comments',commentRouter);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app;