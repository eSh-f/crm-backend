const db = require("../db");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const {email, password, name, role} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (email, passwords, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password, name, role || 'client']
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if(!user) return res.status(404).json({error: 'Пользователь не найден'});

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({error: 'Неверный пароль'});

        const token = jwt.sign({id: user.id, role:user.role}, JWT_SECRET, {expiresIn: '1d'});

        res.json({token, user});
    } catch (error) {
        console.error('Ошибка входа:', error);
        res.status(500).json({ error: 'ошибка входа' });
    }
};

module.exports = {
    register,
    login,
}
