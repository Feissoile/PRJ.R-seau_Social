import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
  sender: String,
  date: Date,
  texte: String,
  picture: String,
  video: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const userSchema = mongoose.Schema({
  nickname: String,
  email: String,
  password: String,
  adress: String,
  description: String,
  isLog: Boolean,
  coverPicture: String,
  profilePicture: String,
  token: String,
  reviews: [reviewSchema],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const User = mongoose.model("users", userSchema);

module.exports = User;
