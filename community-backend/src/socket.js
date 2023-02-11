import SocketIO from "socket.io";
import { removeRoom } from "../src/api/socketServices";

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

    socket.on("join", (data) => {
      socket.join(data);
      socket.to(data).emit("join", {
        user: "system",
        chat: `${"수정해야하는 내용"}님이 입장하셨습니다.`,
      });
    });

    socket.on("disconnect", async () => {
      console.log("chat 네임스페이스 접속 해제");
      const { referer } = socket.request.headers; // 브라우저 주소가 들어있음
      const roomId = new URL(referer).pathname.split("/").at(-1);
      const currentRoom = chat.adapter.rooms.get(roomId);
      /*const userCount = currentRoom.size || 0;
      if (userCount === 0) {
        // 유저가 0명이면 방 삭제
        await removeRoom(roomId); // 컨트롤러 대신 서비스를 사용
        room.emit("removeRoom", roomId);
        console.log("방 제거 요청 성공");
      } else {
        socket.to(roomId).emit("exit", {
          user: "system",
          chat: `${socket.request.session.color}님이 퇴장하셨습니다.`,
        });
      }*/
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
