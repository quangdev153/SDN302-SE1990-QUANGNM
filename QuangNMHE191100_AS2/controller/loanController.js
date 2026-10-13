const Loan = require('../models/Loan');
const book = require('../models/Book');
const member=require('../models/Member')

const getAllLoans = async (req, res) => {
    try {
        const loans = await Loan.find()
            .populate('member_id') 
            .populate('items.book_id'); 
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id)
            .populate('member_id')
            .populate('items.book_id');
            
        if (!loan) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn (Loan not found)' });
        }
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createLoan = async (req, res) => {
    try {
        const { member_id, items, dueDate } = req.body;

        if (!member_id || !items || !dueDate) {
            return res.status(400).json({ 
                message: "Vui lòng cung cấp đầy đủ thông tin: member_id, items và dueDate." 
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ 
                message: "Phải mượn ít nhất 1 cuốn sách (mảng items không được rỗng)." 
            });
        }

        for (let i = 0; i < items.length; i++) {
            if (!items[i].book_id || items[i].quantity === undefined || Number(items[i].quantity) <= 0) {
                return res.status(400).json({ 
                    message: "Mỗi item phải chứa book_id hợp lệ và quantity lớn hơn 0." 
                });
            }
        }

        const newLoan = new Loan(req.body);
        await newLoan.save();
        res.status(201).json(newLoan); 
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getLoansByMemberId = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const loans = await Loan.find({ member_id: memberId })
            .populate('member_id')
            .populate('items.book_id');
            
        if (!loans || loans.length === 0) {
            return res.status(404).json({ message: 'Thành viên này chưa có phiếu mượn nào' });
        }
        
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const returnLoanById = async (req,res)=>{
    try {
        const loanId=req.params.id;
        const loan=await Loan.findByIdAndUpdate(loanId, { isReturned: true }, { new: true });
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    getLoansByMemberId,
    returnLoanById
};