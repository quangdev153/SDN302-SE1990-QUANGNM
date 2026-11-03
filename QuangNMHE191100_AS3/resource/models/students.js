const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentCode: {
         type: String, 
         required: true 
        },
    fullName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    }
});

module.exports = mongoose.model('Student', StudentSchema);
