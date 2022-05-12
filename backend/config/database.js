const mongoose = require("mongoose");



const connectdatabase = ()=>{
  mongoose.connect(process.env.DB_URI).then((data) =>{
    console.log(`Mongodb connected with server ${data.connection.host}`);
  });
}

module.exports = connectdatabase;