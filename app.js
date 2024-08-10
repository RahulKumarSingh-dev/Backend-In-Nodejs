const express = require('express');
require('dotenv').config();
const app = express();

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// import all routes
const productRoute = require('./routes/productRoute');


// router middleware
app.use('/api/v1', productRoute);

// health check route
app.use('/health-check',(req, res)=>{
    res.status(200).json({
        success: true,
        message: 'Health check successfull',
      });
})


module.exports = app;
