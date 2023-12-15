const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Provide the name of the product'],
    trim: true,
    maxlength: [120, 'Product name should be less than 120 char'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide the price of product'],
    maxlength: [5, 'Product price should be less than 5 digits'],
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
  },
  photos: [
    {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
  ],

  category: {
    type: String,
    required: [
      true,
      'Please provide category in shortsleeves, longsleeve, sweatshirt, hoodies',
    ],
    enum: {
      values: ['shortsleeve', 'longsleeve', 'sweatshirt', 'hoodies'],
      message:
        '"Please provide category in ONLY shortsleeves, longsleeve, sweatshirt, hoodies"',
    },
  },
  brand: {
    type: String,
    required: [true, 'Please add brand for clothing'],
  },
  stocks: {
    type: Number,
    required: [true, 'Please provide the stocks'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('Product', productSchema);


