const Product = require("../models/productModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const ApiFeatures = require("../utils/apifeatures");



//creating product based on the model imported from productModel.js ---only for admin
exports.createProduct = catchAsyncErrors(async (req,res,next) =>{

  req.body.user = req.user.id;
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});






//get all products
exports.getAllProducts = catchAsyncErrors(async (req,res) =>{

  const resultPerPage = 5;
  const ProductCount = await Product.countDocuments();

  //Product.find() ==> query && req.query ==> queryStr in constructor of ApiFeature class
  const Apifeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
  const products = await Apifeature.query;
  res.status(201).json({
    success: true,
    products,
    ProductCount
  });

});





//updatind a product ---Only for Admin
exports.updateProduct = catchAsyncErrors(async (req,res, next) =>{

  let product = await Product.findById(req.params.id);
  console.log(product);

  if(!product){
    return next(new ErrorHandler("Product Not Found",404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    // useFindAndModify: false
  });
  res.status(200).json({
    success: true,
    product
  })

});






//delete product
exports.deleteProduct = catchAsyncErrors(async (req,res,next) =>{
  const product = await Product.findById(req.params.id);

  if(!product){
    return next(new ErrorHandler("Product Not Found",404));
  }

  await product.remove();
  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  });
});





//get details about the product
exports.getProductDetails = catchAsyncErrors(async (req,res,next) =>{
  const product = await Product.findById(req.params.id);
  
  if(!product){
    return next(new ErrorHandler("Product Not Found",404));
  }

  res.status(200).json({
    success: true,
    product
  });
});