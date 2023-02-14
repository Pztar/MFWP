import Room from "../schemas/room";
import Chat from "../schemas/chat";

export const removeRoom = async (roomId) => {
  try {
    await Promise.all([
      Room.deleteOne({ _id: roomId }),
      Chat.deleteMany({ Room: roomId }),
    ]);
  } catch (error) {
    console.log(error);
  }
};
