const User = require('../models/userModel');
const BigPromise = require('../middlewares/BIgPromise');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/mailHelper');
const crypto = require('crypto');

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
exports.login = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;
  //check for presence of email and password

  if (!email || !password) {
    return next(new Error('Please provide email and password'));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new Error('Email or password does not exist or match'));
  }

  const isPasswordCorrect = await user.isValidatedPassowrd(password);

  if (!isPasswordCorrect) {
    return next(new Error('Email or password does not exist or match'));
  }

  cookieToken(user, res);
});
exports.logout = BigPromise(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logout success',
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(new Error('User not found'));

  const forgotToken = user.getForgotPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/password/reset/${forgotToken}`;

  const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

  try {
    await mailHelper({
      email: user.email,
      subject: 'Password Rest email',
      message,
    });
    res.status(200).json({
      success: true,
      message: 'Email send successfully',
    });
  } catch (error) {
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(error);
    return next(new Error(error.message));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;
  const encryptToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    forgotPasswordToken: encryptToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error('Token is invalid or expired'));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(new Error('Password and confirm password do not match'));
  }

  user.password = password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  // send a json response or send token

  cookieToken(user, res);
});

exports.userdashboard = BigPromise(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const userId = req.user.id;
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const user = await User.findById(userId).select('+password');

  const isOldPasswordCorrect = user.isValidatedPassowrd(oldPassword);

  if (!isOldPasswordCorrect)
    return next(new Error('Old Password is not correct'));

  user.password = newPassword;

  user.save();
  cookieToken(user, res);
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
  const newData = {
    name: req.body.name,
    email: req.body.email,
  };
  if (req.files && req.files.photo !== '') {
    const user = await User.findById(req.user.id);

    if (user.photo) {
      const imageId = user.photo.id;
      const resp = await cloudinary.v2.uploader.destroy(imageId);

      let file = req.files.photo;
      const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: 'users',
        width: 150,
        crop: 'scale',
      });

      newData.photo = {
        id: result.public_id,
        secure_url: result.secure_url,
      };
    }
  }
  const user = User.findByIdAndUpdate(req.user.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify:false
  });
  res.status(200).json({
    success: true,
  });
});
