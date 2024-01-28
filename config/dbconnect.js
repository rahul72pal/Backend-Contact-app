const mongoose = require("mongoose");
// const dotenv = require("dotenv");
require('dotenv').config();
// console.log(require('dotenv').config())


const dbconnect = () => {
  // console.log(process.env.DATABASE);
  mongoose.connect(process.env.DATABASE
    , {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    }).then(() => {
      console.log("Connection successfully");
    }).catch((er) => {
      console.log("error inconnection", er);
    });
};

module.exports = dbconnect;