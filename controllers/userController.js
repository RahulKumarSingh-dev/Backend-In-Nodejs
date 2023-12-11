const User = require('../models/userModel');
const BigPromise = require('../middlewares/BIgPromise');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');

exports.signup = BigPromise(async (req, res, next) => {
  let result;
  if (req.files) {
    let file = req.files.photo;
    result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: 'users',
      width: 150,
      crop: 'scale',
    });
  }
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new Error('All fields are required'));
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.login = BigPromise(async (req,res,next)=>{
  const {email,password} = req.body
  //check for presence of email and password 

  if(!email||!password){
    return next(new Error('Please provide email and password'))
  }
  const user = await User.findOne({email}).select("+password")

  if(!user){
    return next(new Error('Email or password does not exist or match'))
  }

  const isPasswordCorrect = await user.isValidatedPassowrd(password);

  if(!isPasswordCorrect){
    return next(new Error('Email or password does not exist or match')) 
  }

  cookieToken(user,res)

})
exports.logout = BigPromise(async (req,res,next)=>{
  res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })
  res.status(200).json({
    success:true,
    message:"Logout success",
  })

})
