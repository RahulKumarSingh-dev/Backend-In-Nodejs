const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const BigPromise = require('../middlewares/BIgPromise');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

exports.createOrder = BigPromise(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    taxAmount,
    shippingAmount,
    totalAmount,
    user: req.user._id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});
exports.getOneOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );
  if (!order) {
    return new Error('order not found');
  }
  res.status(200).json({
    success: true,
    order,
  });
});
exports.getLoggedInOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  if (!orders) {
    return new Error('order not found');
  }
  res.status(200).json({
    success: true,
    orders,
  });
});
exports.adminGetAllOrders = BigPromise(async (req, res, next) => {
  const orders = await Order.find();
  res.status(200).json({
    success: true,
    orders,
  });
});
exports.adminUpdateOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order.orderStatus === 'Delivered') {
    return next(new Error('order is already delivered'));
  }

  order.orderStatus = req.body.orderStatus;

  order.orderItems.forEach(async (prod) => {
    await updateProductStock(prod.product, prod.quantity);
  });

  await order.save();
});
exports.adminDeleteOrder = BigPromise(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success:true
  })
});

async function updateProductStock(productId, quantity) {
  const product = await Product.findById(productId);
  product.stocks -= quantity;
  await product.save({ validateBeforeSave: false });
}
