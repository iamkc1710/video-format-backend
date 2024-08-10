const jwt = require('jsonwebtoken');
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
const JWT_USERNAME = 'iamkc1710'
const JWT_PASSWORD = 'VideoApp@!23'
// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const token = header?.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("err", err);
            return res.sendStatus(403);
        }
        console.log("user", req);
        req.user = user;
        next();
    });
};


// Function to generate JWT token
const generateToken = (payload) => {
    console.log("payload", payload);
    if (!payload) {
        return null;
    }
    if (payload.username === JWT_USERNAME && payload.password === JWT_PASSWORD) {
        console.log("JWT_SECRET", JWT_SECRET);
        return jwt.sign(payload, JWT_SECRET);
    }
};

module.exports = {
    authenticateToken,
    generateToken
};