require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error: 'Нет токена'});
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next(); // тут уже дургой обработчик
    } catch(error) {
        return res.status(401).json({error: 'Неверный токен'});
    }
};

module.exports = authMiddleware;

