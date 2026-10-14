const Book = require('../models/Book');

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, isbn, totalCopies,availableCopies } = req.body;
        if (!title || !author || !isbn || totalCopies === undefined || availableCopies === undefined) {
            return res.status(400).json({ 
                message: "Vui lòng nhập đầy đủ thông tin: title, author, isbn, totalCopies và availableCopies." 
            });
        }
        if (Number(totalCopies) < 0 || Number(availableCopies) < 0) {
            return res.status(400).json({ 
                message: "Số lượng bản sao (totalCopies và availableCopies) không được phép là số âm." 
            });
        }
        const existingBook = await Book.findOne({ isbn: isbn });
        if (existingBook) {
            return res.status(400).json({ 
                message: "Sách với mã ISBN này đã tồn tại trong hệ thống." 
            });
        }
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true 
        });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        
        if (!book) {
            return res.status(404).json({ message: "Không tìm thấy cuốn sách này trong hệ thống." });
        }
    
        res.status(200).json({ message: "Đã xóa sách thành công." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
};