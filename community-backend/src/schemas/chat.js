import mongoose from "mongoose";

const { Schema } = mongoose;
const {
  Types: { ObjectId },
} = Schema;

const UserSchema = new Schema({
  id: Number,
  nick: {
    type: String,
    required: true,
  },
});

const ChatSchema = new Schema({
  room: {
    type: ObjectId,
    required: true,
    ref: "Room",
  },
  /*
  room: {
    _id: mongoose.Types.ObjectId,
    required: true,
    ref: 'Room',
  },
  room: {
    _id: mongoose.Types.ObjectId,
    title: String,
  },
  */
  User: UserSchema,
  chat: String,
  gif: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
