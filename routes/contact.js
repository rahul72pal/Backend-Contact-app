const express = require("express");
const route = express.Router();
const {cratePost,singlePost,updatecontact} = require("../controllers/createContact");
const {allContact,deletecontact,imageupload} = require("../controllers/createContact");
// const {auth} = require('../middlewares/Auth')

// route.get()
route.post("/contact/create",cratePost);
route.get("/contact/all",allContact);
route.post("/upload/image",imageupload);
route.get("/contact/single/:id",singlePost);
route.post("/contact/update/:id",updatecontact);
route.delete("/contact/delete/:id",deletecontact);

module.exports = route;