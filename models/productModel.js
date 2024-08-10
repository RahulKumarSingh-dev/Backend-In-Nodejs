const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide the name of the product"],
    trim: true,
    maxlength: [120, "Product name should be less than 120 char"],
  },
  price: {
    type: Number,
    required: [true, "Please provide the price of product"],
    maxlength: [5, "Product price should be less than 5 digits"],
  },
  sales: {
    type: Number,
    required: [true, "Please provide the sales of product"],
  },

  quantity: {
    type: Number,
    required: [true, "Please provide the quantity of product"],
  },

  supplier: {
    type: String,
    required: [true, "Please Provide the name of the supplier"],
    trim: true,
    maxlength: [120, "Supplier name should be less than 120 char"],
  },

  description: {
    type: String,
    required: [true, "Please provide description"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Product", productSchema);
