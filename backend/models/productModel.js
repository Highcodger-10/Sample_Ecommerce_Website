const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the product name."],
    trim: true
  },
  description:{
    type: String,
    required: [true, "Please enter the product description."]
  },
  price: {
    type: Number,
    required: [true, "Please set the price of the item"],
    maxlength: [8, "Price of an Item cannot exceed 8 digits. We are not selling houses here."]
  },
  rating:{
    type: Number,
    default: 0
  },
  image: [{
    public_id:{
      type: String,
      required: true
    },
    url:{
      type: String,
      required: true
    }
  }],
  category:{
    type: String,
    required: [true, "Please select the product category"]
  },
  Stock:{
    type: Number,
    required: [true, "Please enter the number of items unsold"],
    maxlength: 4,
    default: 1
  },
  noOfReviews:{
    type: Number,
    default: 0
  },
  reviews: [{
    name:{
      type: String,
      required: true
    },
    rating:{
      type: Number,
      required: true,
      // default: 0
    },
    comment:{
      type: String,
      required: true
    }
  }],
  createdAt:{
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Product", productSchema);

