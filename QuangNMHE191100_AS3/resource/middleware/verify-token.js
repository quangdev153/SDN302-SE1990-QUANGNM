const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authorization = req.get('Authorization') || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET || 'HE191100');
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
