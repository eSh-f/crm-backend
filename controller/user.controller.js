const db = require('../db');

const getAllUsers = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users',error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const createUser = async (req, res) => {
    const {email, password, role, name, avatar} = req.body;
    try {
        const result = await db.query(
            'INSERT INTO users (email, password, role, name, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, password, role, name, avatar || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user',error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json({ message: 'Пользователь удалён' });
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    deleteUser
};
