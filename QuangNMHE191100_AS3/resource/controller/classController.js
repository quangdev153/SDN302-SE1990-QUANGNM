const mongoose = require('mongoose');
const Class = require('../models/classes');

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

exports.getStudents = async (req,res) =>{
    const {classId} = req.params;
    if(!isObjectId(classId)){
        return res.status(400).json(({message:`Invalid classId: ${classId}`}));
    }
    const status = String(req.query.status || 'enrolled').toUpperCase();
    if(!['ENROLLED','DROPPED'].includes(status)){
        return res.status(400).json({error:"status values must be enrolled or dropped"});
    }
    try{
        const classRecord= await Class.findById(classId).populate({
            path: 'enrollments.studentId',
            select: 'studentCode fullName email'
        });

        if(!classRecord){
            return res.status(404).json({error: `Class with id = ${classId} not Found`});
        }
        const studentList = classRecord.enrollments.filter((entry) => String(entry.status ||'').toUpperCase()===status)
        .map((e)=>{
            const student = e.studentId;
            return{
                id: student._id,
                studentCode: student.studentCode,
                fullName: student.fullName,
                email: student.email
            }
        })
        return res.status(200).json(studentList);
    }
    catch(error){
        return res.status(500).json({error: 'Error server'});
    }
}