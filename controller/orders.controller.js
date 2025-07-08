const db = require('../db');

// все
const getAllOrders = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM orders');
        res.json(result.rows);
    } catch(error) {
        console.error('Error fetching orders:',error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};


//от исполнителя
const getOrdersByFreelancer = async (req, res) => {
    const {freelancerId} = req.query;
    try {
        const result = await db.query(
            'SELECT * FROM orders WHERE freelancer_id = $1',
            [freelancerId]
        );
        res.json(result.rows);
    } catch(error) {
        console.error('Ошибка при получении заказов фрилансера', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

//от заказчиа
const getOrdersByClient = async (req, res) => {
    const {clientId} = req.query;
    try{
        const result = await db.query(
            'SELECT * FROM orders WHERE client_id = $1',
            [clientId]
        );
        res.json(result.rows);
    } catch(error) {
        console.error('Ошибка при получении заказов клиента', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

// создать заказ
const createOrder = async (req, res) => {
    const { title, description, budget, status = 'open', client_id, freelancer_id = null } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO orders (title, description, budget, status, client_id, freelancer_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, budget, status, client_id, freelancer_id]
        );
        res.status(201).json(result.rows[0]);
    } catch(error) {
        console.error('Ошибка при создании заказа', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

// установить испольнителя
const assignFreelancerToOrder = async (req, res) => {
    const { orderId } = req.params;
    const { freelancer_id } = req.body;

    try {
        const result = await db.query(
            'UPDATE orders SET freelancer_id = $1, status = $2 WHERE id = $3 RETURNING *',
            [freelancer_id, 'in_progress', orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Ошибка при назначении фрилансера:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
// удалить заказ
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Заказ не найден' });
        res.json({ message: 'Заказ удалён' });
    } catch (error) {
        console.error('Ошибка при удалении заказа:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const getFilteredOrders = async (req, res) => {
    try{
        const {status, client_id, freelancer_id, search} = req.query;
        let conditions = [];
        let values = [];

        if(status) {
            values.push(status);
            conditions.push(`status = $${values.length}`);
        }

        if(client_id) {
            values.push(client_id);
            conditions.push(`client_id = $${values.length}`);
        }

        if(freelancer_id) {
            values.push(freelancer_id);
            conditions.push(`freelancer_id = $${values.length}`);
        }

        if(search) {

        }

    }
}



module.exports = {
    getAllOrders,
    getOrdersByFreelancer,
    getOrdersByClient,
    createOrder,
    assignFreelancerToOrder,
    deleteOrder
};