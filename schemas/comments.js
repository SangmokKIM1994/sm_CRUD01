const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentsSchema = new mongoose.Schema({
  commentsId: {
    type: Number,
    requierd:true
  },
  postId: {
    type: Number,
    requierd:true
  },
  userId: {
    type: Number,
    requierd:true
  },
  nickname: {
    type: String,
    requierd:true
  },
  comment: {
    type: String,
    requierd:true
  },
},
{timestamps:true}
);

module.exports = mongoose.model("comments", commentsSchema);