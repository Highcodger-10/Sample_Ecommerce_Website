const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const ErrorMiddleware = require("./middleware/error.js");


app.use(express.json());
app.use(cookieParser());

//Importing Route
const product = require("./routes/productRoute.js");
const user = require("./routes/userRoute.js")


//to use the routes from product and user
app.use("/api/v1",product);
app.use("/api/v1", user);


//middleware for handling error
app.use(ErrorMiddleware);



module.exports = app;