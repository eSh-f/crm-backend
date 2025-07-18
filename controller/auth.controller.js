const db = require("../db");
require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET;

const register = async (req, res) => {
    const {email, password, name, role} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, name, role || 'client']
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

const githubOAuth = async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'No code provided' });

    try {
        const tokenRes = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: { Accept: 'application/json' },
            }
        );
        const access_token = tokenRes.data.access_token;
        if (!access_token) return res.status(400).json({ error: 'No access token from GitHub' });

        const userRes = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const emailRes = await axios.get('https://api.github.com/user/emails', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const githubUser = userRes.data;
        const emails = emailRes.data;
        const primaryEmail = Array.isArray(emails) ? emails.find(e => e.primary && e.verified)?.email : null;
        const email = primaryEmail || githubUser.email || null;

        let userResult = await db.query('SELECT * FROM users WHERE github_username = $1', [githubUser.login]);
        let user = userResult.rows[0];
        if (!user && email) {
            userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            user = userResult.rows[0];
        }
        if (user) {
            if (user.github_username !== githubUser.login) {
                await db.query('UPDATE users SET github_username = $1 WHERE id = $2', [githubUser.login, user.id]);
                user.github_username = githubUser.login;
            }
        } else {
            const insertRes = await db.query(
                'INSERT INTO users (email, name, github_username, role) VALUES ($1, $2, $3, $4) RETURNING *',
                [email, githubUser.name || githubUser.login, githubUser.login, 'client']
            );
            user = insertRes.rows[0];
        }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user });
    } catch (error) {
        console.error('GitHub OAuth error:', error);
        res.status(500).json({ error: 'GitHub OAuth error' });
    }
};

module.exports = {
    register,
    login,
    githubOAuth,
}
