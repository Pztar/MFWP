import mongoose from "mongoose";

const { Schema } = mongoose;

const OwnerSchema = new Schema({
  id: Number,
  nick: {
    type: String,
  },
});

const RoomSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  max: {
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  Owner: OwnerSchema,
  password: String,
  Onlines: [{ socketId: String, User: Object }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Room = mongoose.model("Room", RoomSchema);

export default Room;
