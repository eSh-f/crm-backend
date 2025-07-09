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



const getMyProfile = async (req, res) => {
    const userId = req.userId; // todo проверить приходиьт ли из авторизации
    try{
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if(result.rows.length === 0) return res.status(404).json({error: 'Пользователь не найден'});
        res.json(result.rows[0]);
    } catch(error) {
        console.error('Ошибка при получении профиля:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


const createUser = async (req, res) => {
    const {email, password, role, name} = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const result = await db.query(
            'INSERT INTO users (email, password, role, name, avatar) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, password, role, name, avatar]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user',error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


const updateMyProfile = async (req, res) => {
    const userId = req.userId;
    const {email, password, name} = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    try{
        const fields = [];
        const values = [];
        let i = 1;

        if(email) { fields.push(`email = $${i++}`); values.push(email);}
        if(password) { fields.push(`password = $${i++}`); values.push(password);}
        if (name) { fields.push(`name = $${i++}`); values.push(name);}
        if(avatar) { fields.push(`avatar = $${i++}`); values.push(avatar);} // i всегда инкрементируется и $ увеличивается нет иньекций короче

        if(fields.length === 0) {
            return res.status(404).json({error: 'Нет данных для обновления'});
        }

        values.push(userId);

        const result = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
            values
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при обновлении профиля', error);
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
    deleteUser,
    getMyProfile,
    updateMyProfile
};
