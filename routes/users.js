var express = require('express');
var router = express.Router();
const plm=require("passport-local-mongoose");
const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterestt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
   
  },
  
  profileImage: {
    type: String, // Assuming you store the path or URL to the user's profile picture
  },

  posts:[{
type:mongoose.Schema.Types.ObjectId,
ref:'Post'
  }],
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});


/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

userSchema.plugin(plm);//plm=passport local mongosoe

const User = mongoose.model('User', userSchema);

module.exports = User;
//module.exports = router;
