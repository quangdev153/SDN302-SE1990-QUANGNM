const Member = require('../models/Member');

const getAllMembers = async (req, res) => {
    try {
        const members = await Member.find();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json(member);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createMember = async (req, res) => {
    try {
        let { fullName, email, phone, membershipType, isActive } = req.body;

        if (!fullName || !email || !phone || !membershipType) {
            return res.status(400).json({ 
                message: "Vui lòng nhập đầy đủ thông tin bắt buộc: fullName, email, phone và membershipType." 
            });
        }

        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ message: "Email này đã tồn tại trong hệ thống." });
        }

        const permittedTypes = ['Student', 'Teacher', 'Guest'];
        if (!permittedTypes.includes(membershipType)) {
            return res.status(400).json({ 
                message: "membershipType không hợp lệ. Vui lòng chọn: Student, Teacher, hoặc Guest." 
            });
        }

        if (isActive === undefined) {
            isActive = true;
        }

        const newMember = new Member({
            fullName,
            email,
            phone,
            membershipType,
            isActive
        });

        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateMember = async (req, res) => {
    try {
        const { email, membershipType } = req.body;

        if (email) {
            const existingMember = await Member.findOne({ email: email, _id: { $ne: req.params.id } });
            if (existingMember) {
                return res.status(400).json({ message: "Email này đã được sử dụng bởi thành viên khác." });
            }
        }

        if (membershipType) {
            const permittedTypes = ['Student', 'Teacher', 'Guest'];
            if (!permittedTypes.includes(membershipType)) {
                return res.status(400).json({ 
                    message: "membershipType không hợp lệ. Vui lòng chọn: Student, Teacher, hoặc Guest." 
                });
            }
        }

        const member = await Member.findByIdAndUpdate(req.params.id, req.body, { 
            new: true,
            runValidators: true 
        });
        if (!member) return res.status(404).json({ message: 'Member not found' });
        res.status(200).json(member);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteMember = async (req, res) => {
    try {
        const member = await Member.findByIdAndDelete(req.params.id);
        
        if (!member) {
            return res.status(404).json({ message: "Không tìm thấy thành viên này trong hệ thống." });
        }
    
        res.status(200).json({ message: "Đã xóa thành viên thành công." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllMembers,
    getMemberById,
    createMember,
    updateMember,
    deleteMember
};   