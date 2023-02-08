const mongoose = require("mongoose");
const { Schema } = mongoose;

const commentsSchema = new mongoose.Schema({
  
  user: {
    type: String,
    requierd:true
  },
  password: {
    type: String,
    requierd:true
  },
  content: {
    type: String,
    requierd:true
  },
  postId: { type: Schema.Types.ObjectId, ref: "posts"},
},
{timestamps:true}
);

module.exports = mongoose.model("comments", commentsSchema);