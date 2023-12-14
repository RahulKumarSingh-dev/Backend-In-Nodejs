const express = require('express');
const router = express.Router();

const {

} = require('../controllers/productController');

const { isLoggedInUser, customRole } = require('../middlewares/userMiddleware');



module.exports = router;
