const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  addProduct,
  getOneProduct,
  updateOneProduct,
  deleteOneProduct,
  getQueryProducts
} = require('../controllers/productController');

// Product Management: routes

router
  .route('/product/add')
  .post(addProduct);

router
  .route('/product/update/:id')
  .put(updateOneProduct);

router
  .route('/product/delete/:id')
  .delete(deleteOneProduct);

// Inventory Listing: routes

router.route('/product/allProducts').get(getAllProducts);

router.route('/product/singleProduct/:id').get(getOneProduct);

// Searching Product: routes

router.route('/product/search').get(getQueryProducts);





module.exports = router;
