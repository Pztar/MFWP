import { useEffect, useState } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { listRooms } from "../../modules/rooms";
import io from "socket.io-client";
import Chat from "../../components/chat/Chat";
import * as roomsAPI from "../../lib/api/rooms";

const ChatContainer = () => {
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();
  const params = useParams();
  const { search } = useLocation();
  const { rooms, error, loading, user } = useSelector(
    ({ rooms, loading, user }) => ({
      rooms: rooms.rooms,
      error: rooms.error,
      loading: loading["rooms/LIST_ROOMS"],
      user: user.user,
    })
  );

  useEffect(() => {
    const { roomId } = params;
    const { password } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    const inputPassword = password;

    const socket = io.connect("http://localhost:4000/chat", {
      // 네임스페이스
      path: "/socket.io",
    });
    socket.emit("join", roomId);
    socket.on("join", function (data) {
      //다른사람 입장시
    });
    socket.on("exit", function (data) {
      // 누군가 퇴장
    });
    socket.on("chat", function (data) {
      // 누군가 채팅
    });

    const room = roomsAPI.enterRoom({ roomId, inputPassword });
  }, [dispatch, params, search]);

  return <Chat chats={chats} user={user} />;
};

export default ChatContainer;
