const db = require('../db');

// все уведомления пользователя

const getNotificationByUser = async (req, res) => {
    const {userId} = req.params;
    try{
        const result = await db.query(
            'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении уведомлений:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

// создать уведомление

const createNotification = async (req, res) => {
    const {user_id, content} = req.body;
    try{
        const result = await db.query(
            'INSERT INTO notifications (user_id, content) VALUES ($1, $2) RETURNING *',
            [user_id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании уведомления', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

module.exports = {
    getNotificationByUser,
    createNotification,
}