const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: { type: String },
  content: { type: String },
  image: { type: String },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [{ user: String, text: String }],
});

module.exports = mongoose.model("Post", PostSchema);
