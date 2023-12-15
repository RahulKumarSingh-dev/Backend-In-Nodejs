const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOneOrder,
  getLoggedInOrders,
  adminGetAllOrders,
  adminDeleteOrder,
  adminUpdateOrder,
} = require('../controllers/orderController');
const { isLoggedInUser, customRole } = require('../middlewares/userMiddleware');

router.route('/order/create').post(isLoggedInUser, createOrder);
router.route('/order/myorder').get(isLoggedInUser, getLoggedInOrders);
router.route('/order/:id').get(isLoggedInUser, getOneOrder);

// admin routes
router
  .route('/admin/orders')
  .get(isLoggedInUser, customRole('admin'), adminGetAllOrders);
router
  .route('/admin/order/:id')
  .put(isLoggedInUser, customRole('admin'), adminUpdateOrder)
  .delete(isLoggedInUser, customRole('admin'), adminDeleteOrder);

module.exports = router;
