const User = require("../models/userModels.js")
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//Register a user
exports.registerUser = catchAsyncErrors(async (req,res,next) =>{

  const {name, email, password} = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar:{
      public_id: "This is a sample id",
      url: "pp_url"
    }
  });

  sendToken(user, 201, res);
  // const token = user.getJWTToken();

  // res.status(201).json({
  //   success: true,
  //   token
  // });
});


//Login User
exports.userlogin = catchAsyncErrors(async(req,res,next) =>{
  const {email,password} = req.body;
  if(!email || !password){
    return next(new ErrorHandler("Please enter the email and password", 400));
  }
  //we used select method here because password object had an property select which was set to false
  const user = await User.findOne({email: email}).select("+password");

  if(!user){
    return next(new ErrorHandler("Invalid email or password",401));
  }
  const isPasswordMatched = user.comparePassword(password);

  if(!isPasswordMatched){
    return next(new ErrorHandler("Invalid email or password",401));
  }

  sendToken(user, 200, res);
  // const token = user.getJWTToken();

  // res.status(200).json({
  //   success: true,
  //   token
  // });

});



//logout user
exports.userlogout = catchAsyncErrors(async (req,res,next) =>{
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});


//forget password
exports.forgetPassword = catchAsyncErrors(async (req,res,next)=>{
  const user =await User.findOne({email: req.body.email});
  if(!user){
    return next(new ErrorHandler("User not found", 404));
  }

  //get the reset password token
  const resetToken = user.getresetPasswordToken();

  await user.save({validateBeforeSave: false});

  const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordURL}  \n\n  If you have not requested this email then please kindly ignore it.`;

  try{
    await sendEmail({
      email: user.email,
      subject: `Ecommerce password Recovery`,
      message
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    })
  }
  catch(error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined; 
    await user.save({validateBeforeSave: false}); 
    return next(new ErrorHandler(error.message, 500));
  }


});



//Reset passwords

exports.resetPassword = catchAsyncErrors(async (req,res,next)=>{

  //creating hash for the token
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: {$gt: Date.now()},
  });

  if(!user){
    return next(new ErrorHandler("Reset password token is invalid or has been expired", 404));
  }

  if(req.body.password !== req.body.confirmPassword){
    return next(new ErrorHandler("Passwords don't match",400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user,200,res);

});


//get details about a user
exports.getUserDeatils = catchAsyncErrors(async(req,res,next) =>{
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});


//changing password of the user
exports.updateUserPassword = catchAsyncErrors(async(req,res,next) =>{
  const user = await User.findById(req.user.id).select("+password");

  if(!req.body.oldpassword){
    return next(new ErrorHandler("Enter the old password", 401));
  }

  const isPasswordMatched = user.comparePassword(req.body.oldpassword);
  if(!isPasswordMatched){
    return next(new ErrorHandler("Old password is incorrect",401));
  }

  if(req.body.newPassword !== req.body.confirmPassword){
    return next(new ErrorHandler("The two passwords don't match",400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user,200,res);

});


//updating profile of the user
exports.updateUserProfile = catchAsyncErrors(async(req,res,next) =>{
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user.id, newUserdata,{
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });

});

//get all users--only for admin
exports.getallusers = catchAsyncErrors(async(req,res,next)=>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });

}); 


//get a single user
exports.getauser = catchAsyncErrors(async(req,res,next)=>{
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User not found with the id ${req.params.id}`, 400))
  }

  res.status(200).json({
    success: true,
    user,
  });

}); 




//changing role of a particular user --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next) =>{
  const newUserdata = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserdata,{
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.status(200).json({
    success: true
  });

});





//deleting a particular user --Admin
exports.deleteaUser = catchAsyncErrors(async(req,res,next) =>{
 
  const user = await User.findById(req.params.id);

  if(!user){
    return next(new ErrorHandler(`User with the id ${req.params.id} doesn't exist`));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully"
  });

});