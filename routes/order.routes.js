const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrdersByFreelancer,
    getOrdersByClient,
    createOrder,
    assignFreelancerToOrder,
    deleteOrder,
    getFilteredOrders

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

router.get('/filter', getFilteredOrders);





module.exports = router;