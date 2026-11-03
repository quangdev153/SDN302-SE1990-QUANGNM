const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollmentSchema = new Schema({
    studentId: { 
        type: Schema.Types.ObjectId,
         ref: 'Student',
          required: true
         },
    status: { 
        type: String, 
        enum: ['ENROLLED', 'DROPPED'],
         default: 'ENROLLED'
        }
}, { _id: false });

const ClassSchema = new Schema({
    className: {type:String},
    subjectId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Subject' 
    },
    lecturerName: {type:String},
    status: { 
        type: String, 
        enum: ['OPEN', 'CLOSED'], 
        default: 'OPEN'
     },
    enrollments: { 
        type: [EnrollmentSchema], 
        default: [] 
    }
});

module.exports = mongoose.model('Class', ClassSchema);
