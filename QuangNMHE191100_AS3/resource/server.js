require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes')
const studentRoutes = require('./routes/studentRoutes');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/students',studentRoutes);


if (require.main === module) {
    connectDB().then(() => {
        const PORT = process.env.PORT || 9999;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
}

module.exports = app;
