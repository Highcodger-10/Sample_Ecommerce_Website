const app = require("./app.js");
const dotenv = require("dotenv");
const connectdatabase = require("./config/database.js");

//handling uncaught exception
process.on("uncaughtException", (err) =>{
  console.log(`err: ${err.message}`);
  console.log("Server is shutting down due to uncaught exception.");
  process.exit(1);
});

//config
dotenv.config({path: "backend/config/config.env"});

//connect to database
connectdatabase();

// app.listen(process.env.PORT,()=>{
//   console.log(`Server started successfully at http://localhost:${process.env.PORT}`);
// });


const server = app.listen(3000, ()=>{
  console.log("server started successfully at port 3000");
});
// on https://localhost:${process.env.PORT}



//handling Promise rejection
process.on("unhandledRejection", (err) =>{
  console.log(`err:${err.message}`);
  console.log("Server is shutting down due to unhandled promise rejection");
  server.close(()=>{
    process.exit(1);
  });
});