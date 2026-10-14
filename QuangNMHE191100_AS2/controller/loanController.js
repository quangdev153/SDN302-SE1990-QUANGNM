const mongoose = require('mongoose');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Member = require('../models/Member');

const memberFields = 'fullname email phone membershipType isActive';
const bookFields = 'title author category isbn publishedYear totalCopies availableCopies';
const populateLoan = (query) => query
    .populate('member_id', memberFields)
    .populate('items.book_id', bookFields);
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getAllLoans = async (req, res) => {
    try {
        const loans = await populateLoan(Loan.find());
        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getLoanById = async (req, res) => {
    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: 'ID phiếu mượn không hợp lệ.' });
        }

        const loan = await populateLoan(Loan.findById(req.params.id));
        if (!loan) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn (Loan not found)' });
        }
        res.status(200).json(loan);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createLoan = async (req, res) => {
    const updatedBooks = [];

    try {
        const { member_id, items, dueDate } = req.body;

        if (!member_id || !items || !dueDate) {
            return res.status(400).json({
                message: 'Vui lòng cung cấp đầy đủ thông tin: member_id, items và dueDate.'
            });
        }
        if (!isValidId(member_id)) {
            return res.status(400).json({ message: 'member_id không hợp lệ.' });
        }
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: 'Phải mượn ít nhất 1 cuốn sách (mảng items không được rỗng).'
            });
        }

        const requestedQuantities = new Map();
        for (const item of items) {
            const quantity = Number(item.quantity);
            if (!item.book_id || !isValidId(item.book_id)
                || !Number.isInteger(quantity) || quantity <= 0) {
                return res.status(400).json({
                    message: 'Mỗi item phải chứa book_id hợp lệ và quantity là số nguyên lớn hơn 0.'
                });
            }
            const bookId = item.book_id.toString();
            requestedQuantities.set(bookId, (requestedQuantities.get(bookId) || 0) + quantity);
        }

        const member = await Member.findOne({ _id: member_id, isActive: true }).select(memberFields);
        if (!member) {
            return res.status(403).json({ message: 'Chỉ thành viên đang hoạt động mới được mượn sách.' });
        }

        const bookIds = [...requestedQuantities.keys()];
        const books = await Book.find({ _id: { $in: bookIds } }).select(bookFields);
        const booksById = new Map(books.map((item) => [item._id.toString(), item]));

        for (const [bookId, quantity] of requestedQuantities) {
            const book = booksById.get(bookId);
            if (!book) {
                return res.status(404).json({ message: `Không tìm thấy sách với ID ${bookId}.` });
            }
            if (book.availableCopies < quantity) {
                return res.status(400).json({
                    message: `Sách "${book.title}" không đủ số lượng bản sao còn lại để mượn.`
                });
            }
        }

        for (const [bookId, quantity] of requestedQuantities) {
            const book = await Book.findOneAndUpdate(
                { _id: bookId, availableCopies: { $gte: quantity } },
                { $inc: { availableCopies: -quantity } },
                { new: true }
            );
            if (!book) {
                throw new Error('Số lượng sách đã thay đổi trong lúc xử lý. Vui lòng thử lại.');
            }
            updatedBooks.push({ bookId, quantity });
        }

        const newLoan = await Loan.create({ member_id, items, dueDate });
        res.status(201).json(await populateLoan(Loan.findById(newLoan._id)));
    } catch (error) {
        for (const { bookId, quantity } of updatedBooks) {
            await Book.updateOne({ _id: bookId }, { $inc: { availableCopies: quantity } });
        }
        res.status(400).json({ error: error.message });
    }
};

const getLoansByMemberId = async (req, res) => {
    try {
        if (!isValidId(req.params.memberId)) {
            return res.status(400).json({ message: 'ID thành viên không hợp lệ.' });
        }

        const loans = await populateLoan(Loan.find({ member_id: req.params.memberId }));
        if (loans.length === 0) {
            return res.status(404).json({ message: 'Thành viên này chưa có phiếu mượn nào' });
        }

        res.status(200).json(loans);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const returnLoanById = async (req, res) => {
    const restoredBooks = [];

    try {
        if (!isValidId(req.params.id)) {
            return res.status(400).json({ message: 'ID phiếu mượn không hợp lệ.' });
        }

        const loan = await Loan.findById(req.params.id);
        if (!loan) {
            return res.status(404).json({ message: 'Không tìm thấy phiếu mượn (Loan not found).' });
        }
        if (loan.status === 'Returned' || loan.returnDate) {
            return res.status(400).json({ message: 'Phiếu mượn này đã được trả trước đó.' });
        }

        const returnedQuantities = new Map();
        for (const item of loan.items) {
            const bookId = item.book_id.toString();
            returnedQuantities.set(bookId, (returnedQuantities.get(bookId) || 0) + item.quantity);
        }

        const books = await Book.find({ _id: { $in: [...returnedQuantities.keys()] } }).select('_id');
        if (books.length !== returnedQuantities.size) {
            return res.status(404).json({ message: 'Không tìm thấy một hoặc nhiều sách trong phiếu mượn.' });
        }

        for (const [bookId, quantity] of returnedQuantities) {
            await Book.updateOne({ _id: bookId }, { $inc: { availableCopies: quantity } });
            restoredBooks.push({ bookId, quantity });
        }

        loan.returnDate = new Date();
        loan.status = 'Returned';
        await loan.save();

        res.status(200).json(await populateLoan(Loan.findById(loan._id)));
    } catch (error) {
        for (const { bookId, quantity } of restoredBooks) {
            await Book.updateOne({ _id: bookId }, { $inc: { availableCopies: -quantity } });
        }
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllLoans,
    getLoanById,
    createLoan,
    getLoansByMemberId,
    returnLoanById
};