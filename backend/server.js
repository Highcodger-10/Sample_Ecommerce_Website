const app = require("./app.js");
const dotenv = require("dotenv");
const connectdatabase = require("./config/database.js")

//config
dotenv.config({path: "backend/config/config.env"});

//connect to database
connectdatabase();

// app.listen(process.env.PORT,()=>{
//   console.log(`Server started successfully at http://localhost:${process.env.PORT}`);
// });


app.listen(3000, ()=>{
  console.log("server started successfully at port 3000");
});
// on https://localhost:${process.env.PORT}

