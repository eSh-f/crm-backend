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


const authMiddleware = require('../middleware/authMiddleware');


// все заказы
router.get('/',authMiddleware, getAllOrders);

//заказы фрилансера
router.get('/freelancer/:freelancerId',authMiddleware, getOrdersByFreelancer);

//заказы клиента
router.get('/client/:clientId',authMiddleware, getOrdersByClient);

//доб заказ
router.post('/',authMiddleware, createOrder);

// указ фрилансера
router.patch('/:orderId/assign',authMiddleware, assignFreelancerToOrder);

router.delete('/:id',authMiddleware, deleteOrder);

router.get('/filter',authMiddleware, getFilteredOrders);





module.exports = router;