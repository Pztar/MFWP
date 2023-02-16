import Chat from "../../schemas/chat";
import Room from "../../schemas/room";
import { removeRoom as removeRoomService } from "../socketServices";

export const listRooms = async (ctx, next) => {
  /* 페이지네이션 기능 추가시
  const page = parseInt(ctx.query.page || "1", 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }*/
  try {
    //const roomPerPage = 20;
    const rooms = await Room.find({});
    /* 페이지네이션 기능 추가시
      .sort({ _id: -1 })
      .limit(roomPerPage)
      .skip((page - 1) * roomPerPage)
      .exec();
    const roomCount = await Room.countDocuments().exec();
    ctx.set("Last-Page", Math.ceil(roomCount / roomPerPage));
    */
    ctx.body = rooms;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createRoom = async (ctx, next) => {
  try {
    const newRoom = await Room.create({
      title: ctx.request.body.title,
      max: ctx.request.body.max,
      Owner: ctx.state.user,
      password: ctx.request.body.password,
    });
    const io = ctx.io;
    io.of("/room").emit("newRoom", newRoom);

    ctx.body = newRoom;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const enterRoom = async (ctx, next) => {
  try {
    const roomId = ctx.params.roomId;
    const [room, reversedChats] = await Promise.all([
      Room.findOne({ _id: roomId }),
      Chat.find({ Room: roomId }).sort({ _id: -1 }).limit(100),
    ]);
    if (!room) {
      return ctx.redirect("존재하지 않는 방입니다.");
    }
    if (room.password && room.password !== ctx.query.password) {
      return ctx.redirect("/?error=비밀번호가 틀렸습니다.");
    }
    const chats = reversedChats.reverse();
    const roomAndChats = { room, chats };

    const io = ctx.io;
    const { rooms } = io.of("/chat").adapter;

    const userCount = rooms.has(roomId) ? rooms.get(roomId).size : 0;
    console.log("접속자 수", userCount);
    //맨처음 접속시 0명으로 나타나지만 시간이 흐르면 1명이됨;;부정확함
    if (room.max < userCount) {
      //ctx.status = 404;
      ctx.redirect("/error/?error=허용 인원이 초과");
      return console.log("/?error=허용 인원이 초과하였습니다.");
    }
    ctx.body = roomAndChats;
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const removeRoom = async (ctx, next) => {
  try {
    const roomId = ctx.params.roomId;
    await removeRoomService(roomId);
    ctx.request.body = roomId;
    //ctx.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendChat = async (ctx, next) => {
  try {
    const roomId = ctx.params.roomId;
    //console.log("수신테스트", ctx.request.body);
    const chat = await Chat.create({
      Room: roomId,
      User: ctx.state.user,
      chat: ctx.request.body.chatTxt,
      img: ctx.request.body.imgUrl,
    });
    ctx.io.of("/chat").to(roomId).emit("chat", { chat });
    ctx.body = chat;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// export const sendGif = async (req, res, next) => {
//   try {
//     const chat = await Chat.create({
//       room: req.params.id,
//       user: req.session.color,
//       gif: req.file.filename,
//     });
//     req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
//     //res.send("ok");
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };
