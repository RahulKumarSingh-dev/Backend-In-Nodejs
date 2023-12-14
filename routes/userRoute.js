const express = require('express');
const router = express.Router();

const {
  signup,
  login,
  logout,
  forgotPassword,
  passwordReset,
  userdashboard,
  changePassword,
  updateUserDetails,
  adminAllUser,
  managerAllUser,
  adminGetOneUser,
  adminUpdateOneUserDetails,
  adminDeleteOneUser,
} = require('../controllers/userController');

const { isLoggedInUser, customRole } = require('../middlewares/userMiddleware');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userdashboard').get(isLoggedInUser, userdashboard);
router.route('/password/update').post(isLoggedInUser, changePassword);
router.route('/userdashboard/update').post(isLoggedInUser, updateUserDetails);

// admin routes
router
  .route('/admin/users')
  .get(isLoggedInUser, customRole('admin'), adminAllUser);
router
  .route('/admin/user/:id')
  .get(isLoggedInUser, customRole('admin'), adminGetOneUser)
  .put(isLoggedInUser, customRole('admin'), adminUpdateOneUserDetails)
  .delete(isLoggedInUser, customRole('admin'), adminDeleteOneUser);

// manager route
router
  .route('/manager/users')
  .get(isLoggedInUser, customRole('manager'), managerAllUser);

module.exports = router;
