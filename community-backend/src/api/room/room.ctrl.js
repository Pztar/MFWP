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
    if (ctx.request.body.password) {
      // 비밀번호가 있는 방이면
      ctx.redirect(
        `/room/${newRoom._id}?password=${ctx.request.body.password}`
      );
      ctx.body = newRoom;
    } else {
      ctx.redirect(`/room/${newRoom._id}`);
      ctx.body = newRoom;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const enterRoom = async (ctx, next) => {
  try {
    const room = await Room.findOne({ _id: ctx.params.id });
    if (!room) {
      return ctx.redirect("/?error=존재하지 않는 방입니다.");
    }
    if (room.password && room.password !== ctx.query.password) {
      return ctx.redirect("/?error=비밀번호가 틀렸습니다.");
    }
    const io = ctx.io;
    const { rooms } = io.of("/chat").adapter;
    console.log(rooms, rooms.get(ctx.params.id), rooms.get(ctx.params.id));
    if (room.max <= rooms.get(ctx.params.id).size) {
      return ctx.redirect("/?error=허용 인원이 초과하였습니다.");
    }
    return ctx.body;
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const removeRoom = async (ctx, next) => {
  try {
    await removeRoomService(ctx.params.id);
    ctx.body = ctx.params.id;
    ctx.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendChat = async (ctx, next) => {
  try {
    const chat = await Chat.create({
      room: ctx.params.id,
      User: ctx.state.user,
      chat: ctx.body.chat,
    });
    ctx.io.of("/chat").to(ctx.params.id).emit("chat", chat);
    ctx.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const sendGif = async (req, res, next) => {
  try {
    const chat = await Chat.create({
      room: req.params.id,
      user: req.session.color,
      gif: req.file.filename,
    });
    req.app.get("io").of("/chat").to(req.params.id).emit("chat", chat);
    res.send("ok");
  } catch (error) {
    console.error(error);
    next(error);
  }
};
