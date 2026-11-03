const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'HE191100';
const TEST_EMAIL = 'HE191100@fpt.edu.vn';
const TEST_PASSWORD = 'HE191100@123';
const TEST_STUDENT_ID = 'HE191100';

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password || email !== TEST_EMAIL || password !== TEST_PASSWORD) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ studentId: TEST_STUDENT_ID }, JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: 'Login successful', token });
};
