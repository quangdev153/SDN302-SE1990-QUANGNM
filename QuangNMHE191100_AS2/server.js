const express = require('express');
const app = express();
const connectDb = require('./config/db.js');

const bookRouter = require('./routes/bookRouter.js')
const loanRouter = require('./routes/loanRouter.js')
const memberRouter = require('./routes/memberRouter.js')

app.use(express.json());

connectDb();

app.get('/', async(req, res)=>{
    try {
        res.send({message: 'Welcome to Practical Exam!'});
    } catch (error) {
        res.send({error: error.message});
    }
});

app.use('/api/loans', loanRouter);
app.use('/api/books', bookRouter);
app.use('/api/members', memberRouter);

const PORT = process.env.PORT || 9999;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));