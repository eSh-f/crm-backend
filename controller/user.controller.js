const db = require('../db');
const axios = require('axios');
const bcrypt = require('bcrypt');

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
    const userId = req.user.id; 

    try{
        const result = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
        if(result.rows.length === 0) return res.status(404).json({error: 'Пользователь не найден'});

        const user = result.rows[0];

        let githubData = null;

        if(user.github_username){
            try {
                const response = await axios.get(`https://api.github.com/users/${user.github_username}`);
                const data = response.data;

                githubData = {
                    login: data.login,
                    avatar_url: data.avatar_url,
                    html_url: data.html_url,
                    public_repos: data.public_repos,
                    bio: data.bio,
                    followers: data.followers
                };
            } catch (error) {
                console.warn('GitHub профиль не найден или ошибка запроса:', error.message);
            }
        }

        res.json({
            ...user,
            github_profile: githubData,
        });


    } catch(error) {
        console.error('Ошибка при получении профиля:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


const createUser = async (req, res) => {
    const {email, password, role, name, github_username} = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const result = await db.query(
            'INSERT INTO users (email, password, role, name, avatar, github_username) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [email, password, role, name, avatar, github_username || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user',error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


const updateMyProfile = async (req, res) => {
    const userId = req.user.id;
    const {email, password, name, github_username} = req.body;
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    try{
        const fields = [];
        const values = [];
        let i = 1;

        if(email) { fields.push(`email = $${i++}`); values.push(email);}
        if(password) { fields.push(`password = $${i++}`); values.push(password);}
        if (name) { fields.push(`name = $${i++}`); values.push(name);}
        if(avatar) { fields.push(`avatar = $${i++}`); values.push(avatar);} // i всегда инкрементируется и $ увеличивается нет иньекций короче
        if(github_username) { fields.push(`github_username = $${i++}`); values.push(github_username)}

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

const changePassword = async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Необходимо указать старый и новый пароль' });
    }

    try {
        const result = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Пользователь не найден' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Старый пароль неверен' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);
        res.json({ message: 'Пароль успешно изменён' });
    
    } catch (error) {
        console.error('Ошибка при смене пароля:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT id, name FROM users WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Пользователь не найден' });
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при получении пользователя по id', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    deleteUser,
    getMyProfile,
    updateMyProfile,
    changePassword,
    getUserById
};
