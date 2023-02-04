import SocketIO from "socket.io";

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
    console.log("chat 네임스페이스 접속");
    const req = socket.request;
    const {
      headers: { referer },
    } = req;
    const roomId = new URL(referer).pathname.split("/").at(-1);
    socket.join(roomId);
    socket.on("disconnect", () => {
      console.log("chat 네임스페이스 접속 해제");
      socket.leave(roomId);
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
