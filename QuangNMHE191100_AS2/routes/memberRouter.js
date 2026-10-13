const express = require('express');
const memberController = require('../controller/memberController');
const memberRouter = express.Router();

memberRouter.route('/')
    .get(memberController.getAllMembers)
    .post(memberController.createMember);

memberRouter.route('/:id')
    .get(memberController.getMemberById)
    .put(memberController.updateMember)
    .delete(memberController.deleteMember);

module.exports = memberRouter;