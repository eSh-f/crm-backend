const db = require('../db');

//получить отзывы пользователя
const getReviewsForUser = async (req, res) => {
    const { userId} = req.params;
    try{
        const result = await db.query(
            'SELECT * FROM reviews WHERE to_user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении отзывов', error);
        res.status(500).json({error: 'Internal Server Error'});
        }
};

// создать отзыы

const createReview = async (req, res) => {
    const {from_user_id, to_user_id, order_id, rating, comment} = req.body;
    try {
        const result = await db.query(
            'INSERT INTO reviews (from_user_id, to_user_id, order_id, rating, comment ) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [from_user_id, to_user_id, order_id,rating ,comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при создании отзыва:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

const deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Отзыв не найден' });
        res.json({ message: 'Отзыв удалён' });
    } catch (error) {
        console.error('Ошибка при удалении отзыва:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    getReviewsForUser,
    createReview,
    deleteReview
}
