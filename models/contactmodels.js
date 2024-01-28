const mongoose = require("mongoose");

const contactschema = mongoose.Schema({

  fullname:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  phonenumber:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    // required: true,
  },
  birth:{
    type: Date,
    // required: true,
  },
},{timeStamps: true , collection: "Contacts"});

module.exports = mongoose.model("Contact",contactschema);