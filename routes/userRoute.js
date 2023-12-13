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
  updateUserDetails
} = require('../controllers/userController');

const {isLoggedInUser} = require('../middlewares/userMiddleware');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/password/reset/:token').post(passwordReset);
router.route('/userdashboard').get(isLoggedInUser, userdashboard);
router.route('/password/update').post(isLoggedInUser, changePassword);
router.route('/userdashboard/update').post(isLoggedInUser, updateUserDetails);

module.exports = router;
