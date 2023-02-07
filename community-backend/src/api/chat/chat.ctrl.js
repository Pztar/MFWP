const Chat = require("../../schemas/chat"); // 왜인지 예제에 없음
const Room = require("../../schemas/room");

export const listRooms = async (ctx, next) => {
  try {
    const rooms = await Room.find;
  } catch (error) {
    console.error(error);
    next(error);
  }
};
