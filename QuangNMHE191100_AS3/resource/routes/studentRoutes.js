const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verify-token');
const attendanceController = require('../controller/attendanceController');
router.use(verifyToken);
router.get('/:studentId/attendances',attendanceController.getStudentAttendanceHistory);

module.exports = router;
