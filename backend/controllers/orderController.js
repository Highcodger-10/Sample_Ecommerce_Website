const Order = require("../models/orderModel.js");
const Product = require("../models/productModel.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const ErrorHandler = require("../utils/ErrorHandler.js");


//creating a new order
exports.createnewOrder = catchAsyncError(async (req,res,next)=>{
  const {
    shippingInfo,
    orderedItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderedItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order
  });
});


//get a single order
exports.getSingleOrder = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id).populate("user", "name email"); //instead of getting the user id, we can get the name and email for the user making the request
  if(!order){
    return next(new ErrorHandler("Order not found ", 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});   


//getting orders of the user logged in
exports.getmyOrders = catchAsyncError(async(req,res,next)=>{
  const orders = await Order.find({user: req.user._id});

  res.status(200).json({
    success: true,
    orders
  });
});   






//getting all orders --Admin
exports.getallOrders = catchAsyncError(async(req,res,next)=>{
  const orders = await Order.find();

  var totalamount = 0;

  orders.forEach(order=>{
    totalamount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    orders,
    totalamount
  });
});   




//updating a particular order --Admin
exports.updatingOrder = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if(order.orderStatus === "Delivered"){
    return next(new ErrorHandler("Order already delivered. Can't make any changes now", 400));
  }

  order.orderedItems.forEach( async (o)=>{
    await updateStock(o.product, o.quantity);
  }); 

  order.orderStatus = req.body.status;
  if(req.body.status === "Delivered"){
    order.deliveredAt = Date.now();
  }

  await order.save({validateBeforeSave: false});

  res.status(200).json({
    success: true,
    order,
    totalamount
  });
});   

async function updateStock(id, quantity){
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({validateBeforeSave: false});
}




//delete an order --Admin
exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if(!order){
    return next(new ErrorHandler("Order not found ", 404));
  }


  await order.remove();

  res.status(200).json({
    success: true, 
  });
});  