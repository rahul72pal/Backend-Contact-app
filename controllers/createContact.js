const Contact = require("../models/contactmodels");
const cloudinary = require('cloudinary').v2;

module.exports.imageupload =async(req,res)=>{
  try {
    const file = req.files.file;
    console.log("File is here", file);
    let path = __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
    console.log("path = ",path);
    file.mv(path,(er)=>{
      console.log(er);
    });
    
    return res.status(200).json({
      success: true,
      message: "file upload successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "errorr New contact create",
      error: error.message
    })
  }
}

async function fileuploadTocloudinary(file,folder){
  // console.log("fileuploader start");
  const options = {folder};
  const response = await cloudinary.uploader.upload(file.tempFilePath,options)
  // console.log("file uploder end")
  return response;
}

module.exports.cratePost = async(req,res)=>{
  try {
    console.log("CreatePPsot= ",req);
    const file = req.files.file;
    // console.log("File is here", file);
    const {fullname,email,phonenumber,birth} = req.body;

    console.log("file support start")
    const supporttags = ["jpg","jpeg","png"];
    const filetype = file.name.split(".")[1].toLowerCase();
    // console.log(filetype);
    // console.log("Middles");

    if(!supporttags.includes(filetype)){
      return res.status(400).json({
      success: false,
      message: "errorr New contact create",
    })
    }
    // console.log("file support end")

    const response = await fileuploadTocloudinary(file,"contactapp");
    // console.log(response);
    
    // console.log(fullname,email,phonenumber,birth);
    const newcontact = await Contact.create({
      fullname: fullname,
      email: email,
      phonenumber: phonenumber,
      birth: birth,
      image: response.secure_url
    });

    return res.status(200).json({
      success: true,
      conatct: newcontact,
      response: response,
      message: "New contact create",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "errorr New contact create",
      error: error.message
    })
  }
}

module.exports.allContact = async(req,res)=>{
  try {
    // console.log(req.body);
    // console.log("allContact");
    const allcontact = await Contact.find({});
    return res.status(200).json({
      success: true,
      conatct: allcontact,
      message: "all contact fetched",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "errorr all contact create",
      error: error.message
    })
  }
}

module.exports.singlePost = async(req,res)=>{
  try {
    const id = req.params.id;
    const singleconatct = await Contact.findById({_id:id});
    return res.status(200).json({
      success: true,
      conatct: singleconatct,
      message: "single contact fetched",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "errorr single contact ",
      error: error.message
    })
  }
}

module.exports.updatecontact = async(req,res)=>{
  try {
    const id = req.params.id;
    const {fullname,email,phonenumber,birth} =req.body;
    const updateconatct = await Contact.findByIdAndUpdate({_id:id},{fullname,email,phonenumber,birth},{new: true});
    return res.status(200).json({
      success: true,
      conatct: updateconatct,
      message: "update contact fetched",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "update single contact ",
      error: error.message
    })
  }
}

module.exports.deletecontact = async(req,res)=>{
  try {
    const id = req.params.id;
     await Contact.findByIdAndDelete({_id:id});
    return res.status(200).json({
      success: true,
      message: "single contact deleted",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "delete single contact ",
      error: error.message
    })
  }
}