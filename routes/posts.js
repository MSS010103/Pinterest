const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/pinterestt");
const postSchema = new mongoose.Schema({
  imageText: {
    type: String,
    required: true,
  },
  description:String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
image:{
    type:String,

},
  users:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
      }],
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
