const Product = require("../models/productModel");

exports.addProduct = async (req, res) => {
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return new Error("No product found with this id");
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(200).json({
    success: true,
    products,
  });
};

exports.updateOneProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!product) return new Error("No product found with this id");
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.deleteOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new Error("Product not found by this id"));
  
    await Product.deleteOne({ _id: req.params.id });
  
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

exports.getQueryProducts = async (req, res, next) => {
  try {
    const { name, description, supplier } = req.query;

    // Build the query object
    const query = {
      ...(name && { name: { $regex: name, $options: 'i' } }),
      ...(description && { description: { $regex: description, $options: 'i' } }),
      ...(supplier && { supplier: { $regex: supplier, $options: 'i' } })
    };

    // Query the database
    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    console.error(error);
  }
};
