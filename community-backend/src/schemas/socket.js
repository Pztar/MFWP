import mongoose from "mongoose";

const { Schema } = mongoose;

const OwnerSchema = new Schema({
  id: Number,
  nick: {
    type: String,
  },
});

const SocketSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  Owner: OwnerSchema,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Socket = mongoose.model("Socket", SocketSchema);

export default Socket;
