const app = require("./app.js");
const dotenv = require("dotenv");


dotenv.config({path: "backend/config/config.env"});

app.listen(3000,()=>{
  console.log("Server started successfully ");
});

// on https://localhost:${process.env.PORT}

