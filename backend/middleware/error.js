const ErrorHandler = require("../utils/ErrorHandler.js");

module.exports = (err, req,res , next)=>{
  err.statusCode = err.statusCode || 500;   //500 : Internal Server error
  err.message = err.message || "Internal Server Error";

  //handling mongodb id error called as cast error
  if(err.name === "CastError"){
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }


  res.status(err.statusCode).json({
    success: false,
    message: err.message
    //error: err.stack to check where exactly error is
  });
};