import Room from "../schemas/room";
import Chat from "../schemas/chat";

export const removeRoom = async (roomId) => {
  try {
    await Room.deleteOne({ _id: roomId });
    await Chat.deleteMany({ room: roomId });
  } catch (error) {
    console.log(error);
  }
};
