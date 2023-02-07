const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  title: {
    type: String
  },
  content: {
    type: String
  }
});

module.exports = mongoose.model("Posts", postSchema);