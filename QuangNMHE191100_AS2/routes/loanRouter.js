const express = require('express');
const loanController = require('../controller/loanController');
const loanRouter = express.Router();

loanRouter.route('/')
    .get(loanController.getAllLoans)
    .post(loanController.createLoan);

loanRouter.route('/:id')
    .get(loanController.getLoanById);

loanRouter.route('/member/:memberId')
    .get(loanController.getLoansByMemberId);

loanRouter.route('/:id/return')
    .put(loanController.returnLoanById);

module.exports = loanRouter;
