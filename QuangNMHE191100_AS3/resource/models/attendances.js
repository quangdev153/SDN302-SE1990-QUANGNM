const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
    studentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Student', required: true 
    },
    classId: { 
        type: Schema.Types.ObjectId,
        ref: 'Class', required: true 
    },
    date: {
         type: Date, 
         required: true 
        },
    status: {
         type: String, enum: ['PRESENT', 'ABSENT'],
          required: true 
        }
}, { timestamps: true });

AttendanceSchema.index({ classId: 1, studentId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
