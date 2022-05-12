const express = require("express");
const app = express();
const ErrorMiddleware = require("./middleware/error.js");

app.use(express.json());

//Importing Route
const product = require("./routes/productRoute.js");

app.use("/api/v1",product);


//middleware for handling error
app.use(ErrorMiddleware);



module.exports = app;