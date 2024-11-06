const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Publication" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  texte: String,
  picture: String,
  video: String,
  date: Date,
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
