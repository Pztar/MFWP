import SSE from "sse";

export default (server) => {
  const sse = new SSE(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });
  sse.on("connection", (client) => {
    // 서버센트이벤트 연결
    client.send(Date.now().toString());
    setInterval(() => {
      client.send(Date.now().toString());
    }, 1000);
  });
};
