const mongoose = require('mongoose');
const Class = require('../models/classes');
const Student = require('../models/students');
const Attendance = require('../models/attendances');
const Subject = require('../models/subjects');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

exports.getAttendanceSummary = async(req,res) =>{
    const {classId} = req.params;
    if(!isObjectId(classId)){
        return res.status(400).json({error: `Invalid classId: ${classId}`})
    }
    try{
        const classRecord = await Class.findById(classId).populate({
            path: 'enrollments.studentId',
            select: 'studentCode fullName'
        });
        if(!classRecord){
            return res.status(404).json({error: `Class with id = ${classId} not found`});
        }

        const enrolledStudent = classRecord.enrollments.filter((entry) => String(entry.status || '').toUpperCase()==='ENROLLED');
        const attendances = await Attendance.find({classId});
        const attendanceCount = attendances.reduce((acc,record) => {
            const sid = String(record.studentId);
            if(!acc[sid]){
                acc[sid]={totalSessions: 0, present: 0, absent:0}
            }
            acc[sid].totalSessions +=1;
            acc[sid][record.status === 'PRESENT'?'present':'absent']+=1
            return acc;
        },{});
        const summary = enrolledStudent.map((entry)=>{
            const student = entry.studentId;
            const sid = String(student._id);
            const stats = attendanceCount[sid] || {totalSessions: 0, present: 0, absent:0};
            const attendanceRate = Math.round((stats.present/stats.totalSessions)*100);
            const warning = attendanceRate < 80 ? true:false; 
            return {
                studentCode: student.studentCode,
                fullName: student.fullName,
                totalSessions: stats.totalSessions,
                present: stats.present,
                absent: stats.absent,
                attendanceRate: attendanceRate,
                warning: warning
            }
        })
        return res.status(200).json(summary);
    }catch(e){
        return res.status(500).json({"error":`${e}`})
    }
}

exports.getStudentAttendanceHistory = async (req, res) => {
    const { studentId } = req.params;
    if (!isObjectId(studentId)) return res.status(400).json({ error: `Invalid studentId: ${studentId}` });

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: `Student with id = ${studentId} not found` });
        const records = await Attendance.find({ studentId }).sort({ date: -1 }).populate({
            path: 'classId',
            populate: { path: 'subjectId' }
        });
        return res.status(200).json(records.map((record) => ({
            id: record._id,
            className: record.classId?.className,
            subjectName: record.classId?.subjectId?.name,
            date: record.date,
            status: record.status
        })));
    } catch (error) {
        return res.status(500).json({ message:`${error.message}`});
    }
};

exports.upsertAttendances = async (req, res) => {
    const { classId } = req.params;
    if(!isObjectId(classId)) return res.status(400).json({ error: `Invalid classId: ${classId}` });
    const classs = await Class.findById(classId);
    if (!classs) return res.status(404).json({error: `Class with id = ${classId} not found` });
    const { date, records } = req.body;
    const parsedDate = new Date(date);
    if (!date || Number.isNaN(parsedDate.getTime()) || parsedDate > new Date()) {
        return res.status(400).json({ error: 'date is required, valid, and cannot be in the future' });
    }
    if (!Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ error: 'records must be a non-empty array' });
    }

    try {
        if (!classs) return;
        const enrolled = classs.enrollments.filter((entry) => String(entry.status || '').toUpperCase()==='ENROLLED')
        const expectedIds = new Set(enrolled.map((entry) => String(entry.studentId)));
        const seenIds = new Set();
        for (const record of records) {
            if (!isObjectId(record.studentId) || !expectedIds.has(String(record.studentId)) || seenIds.has(String(record.studentId)) || !['PRESENT', 'ABSENT'].includes(record.status)) {
                return res.status(400).json({ message: 'Each record must contain an enrolled studentId and PRESENT or ABSENT status' });
            }
            seenIds.add(String(record.studentId));
        }
        if (seenIds.size !== expectedIds.size) {
            return res.status(400).json({ message: 'Attendance is required for every enrolled student' });
        }

        const operations = records.map((record) => ({
            updateOne: {
                filter: { classId, studentId: record.studentId, date: parsedDate },
                update: { $set: { status: record.status } },
                upsert: true
            }
        }));
        const updateCount=await Attendance.bulkWrite(operations);
        return res.status(200).json({ 
            message: 'Attendance recorded successfully',
            totalRecords: records.length,
            present: records.filter((r) =>String(r.status).toUpperCase()==='PRESENT').length,
            absent: records.filter((r)=> String(r.status).toUpperCase()==='ABSENT').length,
            updateCount: updateCount.modifiedCount
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save attendance records' });
    }
};
