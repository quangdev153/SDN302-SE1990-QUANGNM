const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    member_id: {
        type: String,
        ref: 'Member',
        required: true
    },
    
    items: [{
        book_id: {
            type: String,
            ref: 'Book',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    
    borrowDate: { 
        type: Date, 
        default: Date.now 
    },
    dueDate: { 
        type: Date, 
        required: true 
    },
    returnDate: { 
        type: Date, 
        default: null 
    },
    
    status: {
        type: String,
        enum: ['Borrowing', 'Overdue', 'Returned'], 
        default: 'Borrowing'
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Loan', loanSchema);