const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrdersByFreelancer,
    getOrdersByClient,
    createOrder,
    assignFreelancerToOrder,
    deleteOrder

} = require ('../controller/orders.controller');

// все заказы
router.get('/', getAllOrders);

//заказы фрилансера
router.get('/freelancer/:freelancerId', getOrdersByFreelancer);

//заказы клиента
router.get('/client/:clientId', getOrdersByClient);

//доб заказ
router.post('/', createOrder);

// указ фрилансера
router.patch('/:orderId/assign', assignFreelancerToOrder);

router.delete('/:id', deleteOrder);




module.exports = router;