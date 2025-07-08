const db = require("../db");

const getMessageByOrder = async (req, res) => {
    const { orderId } = req.params;
    try {
        const result = await db.query(
            'SELECT * FROM messages WHERE order_id = $1 ORDER BY created_at ASC',
            [orderId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении сообщений:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createMessage = async (req, res) => {
    const { order_id, sender_id, text } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO messages (order_id, sender_id, text) VALUES ($1, $2, $3) RETURNING *',
            [order_id, sender_id, text]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании сообщения', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getMessageByOrder,
    createMessage,
};