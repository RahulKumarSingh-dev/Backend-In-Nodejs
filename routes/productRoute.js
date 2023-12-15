const express = require('express');
const router = express.Router();

const {
  getAllProduct,
  addProduct,
  adminGetAllProducts,
  getOneProduct,
  adminUpdateOneProduct,
  adminDeleteOneProduct,
  addReview,
  deleteReview,
  getOnlyReviewsForOneProduct,
} = require('../controllers/productController');

const { isLoggedInUser, customRole } = require('../middlewares/userMiddleware');

// user routes
router.route('/products').get(getAllProduct);
router.route('/product/:id').get(getOneProduct);
router.route('/product/:id').get(getOneProduct);
router
  .route('/review')
  .put(isLoggedInUser, addReview)
  .delete(isLoggedInUser, deleteReview);
router.route('/reviews').get(isLoggedInUser, getOnlyReviewsForOneProduct);

// admin routes
router
  .route('/admin/product/add')
  .post(isLoggedInUser, customRole('admin'), addProduct);
router
  .route('/admin/products')
  .get(isLoggedInUser, customRole('admin'), adminGetAllProducts);

router
  .route('/admin/product/:id')
  .put(isLoggedInUser, customRole('admin'), adminUpdateOneProduct)
  .delete(isLoggedInUser, customRole('admin'), adminDeleteOneProduct);

module.exports = router;
