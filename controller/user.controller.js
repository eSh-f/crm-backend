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

module.exports = {
    getAllUsers,
};
