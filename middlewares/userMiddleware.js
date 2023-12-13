const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const BigPromise = require('./BIgPromise')

exports.isLoggedInUser = BigPromise(async (req,res,next)=>{


  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","")

  if(!token)return next(new Error('Login First to Access this Route'))

  const decoded = jwt.verify(token,process.env.JWT_SECRET)

  req.user = await User.findById(decoded.id)

  next();

})