const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  
  nickname: {
    type: String,
    requierd:true
  },
  title: {
    type: String,
    requierd:true
  },
  content: {
    type: String,
    requierd:true
  },
  postId: {
    type:Number,
    requierd:true
  },
  userId: {
    type:Number,
    requierd:true
  }
},
{timestamps:true}
);

module.exports = mongoose.model("posts", postSchema);