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





//create a new review or update a review
exports.createProductReview = catchAsyncErrors(async (req,res,next)=>{

  const {rating, comment , productId} = req.body;

  const review ={
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: comment
  }


  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString());

  if(isReviewed){
    product.reviews.forEach(rev =>{
      if(rev.user.toString() === req.user._id.toString()){
        rev.rating = rating;
        rev.comment = comment; 
      }
    });
  }
  else{
    product.reviews.push(review);
    product.noOfReviews = product.reviews.length;
  }

  var avg = 0;
  product.reviews.forEach(rev =>{
    avg+= rev.rating;
  });
  product.ratings = avg/product.reviews.length;

  await product.save({validateBeforeSave: false});

  res.status(200).json({
    success: true
  });


});




//get all reviews of a product
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews
  });
});





//deleting a review
exports.deletereview = catchAsyncErrors(async(req,res,next)=>{
  const product = await Product.findById(req.query.productId);
  if(!product){
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter((rev)=> rev._id.toString() !== req.query.id.toString());

  var avg = 0;
  reviews.forEach(rev =>{
    avg+= rev.rating;
  });
  const ratings = avg/reviews.length;

  const numofReviews = reviews.length;

  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numofReviews
  }, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true,
  });


})