const express = require('express');
const bookController = require('../controller/bookController');
const bookRouter = express.Router();

bookRouter.route('/')
    .get(bookController.getAllBooks)
    .post(bookController.createBook);

bookRouter.route('/:id')
    .get(bookController.getBookById)
    .put(bookController.updateBook)
    .delete(bookController.deleteBook);

module.exports = bookRouter;