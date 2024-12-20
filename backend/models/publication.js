import mongoose from 'mongoose';

const publicationSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  profilePicture:String,
  nickname: String,
  texte: String,
  picture: String,
  video: String,
  date: Date,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  });

const Publication = mongoose.model("publications", publicationSchema);

export default Publication;
