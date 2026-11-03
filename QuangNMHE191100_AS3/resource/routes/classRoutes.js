const express = require('express');
const classController = require('../controller/classController');
const attendanceController = require('../controller/attendanceController');
const verifyToken = require('../middleware/verify-token');

const router = express.Router();

router.use(verifyToken);
router.get('/:classId/students', classController.getStudents);
router.post('/:classId/attendances', attendanceController.upsertAttendances);
router.get('/:classId/attendance-summary', attendanceController.getAttendanceSummary);

module.exports = router;
