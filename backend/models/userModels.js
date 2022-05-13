const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); //we have crypto by deafult

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: [true, "Please enter your name"],
    maxLength: [30, "Name cannot be more than 30 characters"],
    minLength: [2, "Name cannot be less than 2 characters"],
  },
  email:{
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password:{
    type: String,
    required: [true, "Please enter the password"],
    minLength: [8, "Password cannot be less than 8 characters"],
    select: false
  },
  avatar:{
    public_id:{
      type: String,
      required: true
    },
    url:{
      type: String,
      required: true
    }
  },
  role:{
    type: String,
    default: "user"
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});


//we cant use this method in arrow function
userSchema.pre("save", async function(next){
  if(!this.isModified("password")){
    next();
  }

  this.password = await bcrypt.hash(this.password,10);//10== salt
});

//JWT Web token
userSchema.methods.getJWTToken = function(){
  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}


//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
  return await bcrypt.compare(enteredPassword, this.password);
};

//reset passsword by generating password reset token
userSchema.methods.getresetPasswordToken = function(){

  //to generate a token
  const resetToken = crypto.randomBytes(20).toString("hex");


  //hashing and adding resetpasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15*60*1000;

  return resetToken;
}

module.exports = mongoose.model("User", userSchema);