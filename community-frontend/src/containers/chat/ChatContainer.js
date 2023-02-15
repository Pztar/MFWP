import { useEffect, useState } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { listRooms } from "../../modules/rooms";
import io from "socket.io-client";
import Chat from "../../components/chat/Chat";
import * as roomsAPI from "../../lib/api/rooms";

const ChatContainer = () => {
  const [room, setRoom] = useState({});
  const [chats, setChats] = useState([]);
  const [onlines, setOnlines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const params = useParams();
  const { search } = useLocation();
  const { user } = useSelector(({ user }) => ({
    user: user.user,
  }));

  useEffect(() => {
    const User = user;
    const { roomId } = params;
    const { password } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    const inputPassword = password;

    const socket = io.connect("http://localhost:4000/chat", {
      // 네임스페이스
      path: "/socket.io",
    });
    socket.emit("join", { roomId, User });
    socket.on("join", function (data) {
      //다른사람 입장시
      console.log("입장", data, 1, data.user, 2, data.chat, 3, data.Onlines);
      setOnlines(data.Onlines);
      console.log(onlines);
    });
    socket.on("exit", function (data) {
      // 누군가 퇴장
      console.log("퇴장", data, 1, data.user, 2, data.chat, 3, data.Onlines);
      setOnlines(data.Onlines);
      console.log(onlines);
    });
    socket.on("chat", function (data) {
      // 누군가 채팅
    });

    roomsAPI.enterRoom({ roomId, inputPassword }).then(
      (result) => {
        setRoom(result.data.room);
        setChats(result.data.chats);
        console.log(result.data, "eeeee");
        setLoading(false);
      },
      (e) => {
        setError(true);
        console.log("에러발생");
      }
    );
  }, [params, search]);

  return (
    <Chat
      room={room}
      chats={chats}
      user={user}
      onlines={onlines}
      loading={loading}
      error={error}
    />
  );
};

export default ChatContainer;
