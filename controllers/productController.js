const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Product = require('../models/Product');

// @desc    Add a new product
// @route   POST /api/products
// @access  Private
exports.addProduct = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

// @desc    Get all products
// @route   Get /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
  const product = await Product.find();
  res.status(200).json({
    success: true,
    count: product.length,
    data: product,
  });
});

// @desc    Get single product
// @route   Get /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(`Product with id ${req.params.id} not found`, 404)
    );
  }

  // Make sure user is product owner
  if (product.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this product`,
        401
      )
    );
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
exports.deleteProduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product with id ${req.params.id} not found`, 404)
    );
  }

  // Make sure user is product owner
  if (product.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this product`,
        401
      )
    );
  }

  product = await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
};
