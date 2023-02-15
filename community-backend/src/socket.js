import SocketIO from "socket.io";
import { removeRoom } from "../src/api/socketServices";
import Room from "./schemas/room";

export default (server, app) => {
  const io = SocketIO(
    server,
    {
      cors: {
        origin: "http://localhost:3000",
        credentials: true,
      },
    },
    { path: "/socket.io" }
  );
  app.context.io = io;

  const room = io.of("/room");
  const chat = io.of("/chat");
  const auction = io.of("/auction");

  room.on("connection", (socket) => {
    console.log("room 네임스페이스 접속");
    socket.on("disconnect", () => {
      console.log("room 네임스페이스 접속 해제");
    });
  });

  chat.on("connection", (socket) => {
    console.log("chat 네임스페이스에 접속");

    socket.on("join", async (data) => {
      const roomDB = await Room.findOneAndUpdate(
        { _id: data.roomId },
        {
          $push: { Onlines: { socketId: socket.id, User: data.User } },
        },
        { new: true }
      );
      socket.join(data.roomId);
      socket.to(data.roomId).emit("join", {
        user: "system",
        chat: `${data.User.nick}님이 입장하셨습니다.`,
        Onlines: roomDB.Onlines,
      });
    });

    socket.on("disconnecting", async (reason) => {
      console.log("chat 네임스페이스 접속 해제 중");
      const { rooms } = socket;
      /*for (let [key, value] of rooms) {
        if (value !== socket.id) {
          console.log(key, value);
        }
      }*/ //key value에 한글자씩만 저장되는 이상한 오류가 남
      //const socketToUser = await Socket.findOne({ id: socket.id });
      let roomId = "";
      rooms.forEach((value, key, map) => {
        if (value !== socket.id) {
          roomId = key;
        }
      });
      const roomDB = await Room.findOneAndUpdate(
        { _id: roomId },
        {
          $pull: { Onlines: { socketId: socket.id } },
        }
        //{ new: true } //true이면 수정 후 객체를 반환
      );
      const userCount = roomDB.Onlines.length;

      if (userCount === 1) {
        //수정되기 전 객체를 반환 했으므로 1명
        await removeRoom(roomId); // 컨트롤러 대신 서비스를 사용
        room.emit("removeRoom", roomId);
        console.log("방 제거 요청 성공");
      } else {
        const disconnectingUser = roomDB.Onlines.find(
          (item) => item.socketId === socket.id
        );
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${disconnectingUser.User.nick}님이 퇴장하셨습니다.`,
          Onlines: roomDB.Onlines.filter((item) => item !== disconnectingUser),
        });
      }
    });

    socket.on("disconnect", async () => {
      console.log("chat 네임스페이스 접속 해제");
      console.log(socket.id, "연결종료시 소켓");
    });
  });

  auction.on("connection", (socket) => {
    // 웹 소켓 연결 시
    console.log("auction 네임스페이스 접속");
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = new URL(referer).pathname.split("/").at(-1);
    socket.join(roomId);
    socket.on("disconnect", () => {
      console.log("auction 네임스페이스 접속 해제");
      socket.leave(roomId);
    });
  });
};
