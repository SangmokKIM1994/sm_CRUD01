const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  
  user: {
    type: String,
    requierd:true
  },
  password: {
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
},
{timestamps:true}
);

module.exports = mongoose.model("posts", postSchema);