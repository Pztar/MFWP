import { useEffect, useRef, useState } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import io from "socket.io-client";
import Chat from "../../components/chat/Chat";
import { concatChats, enterRoom, listOnlines } from "../../modules/chats";

const ChatContainer = () => {
  const scollToRef = useRef();
  const params = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const { room, chats, onlines, loading, error, user } = useSelector(
    ({ chats, loading, user }) => ({
      room: chats.room,
      chats: chats.chats,
      onlines: chats.onlines,
      error: chats.error,
      loading: loading["chats/ENTER_ROOM"],
      user: user.user,
    })
  );
  const [autoScroll, setAutoScroll] = useState(true);

  const { roomId } = params;
  const { password } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });
  const inputPassword = password;

  useEffect(() => {
    dispatch(enterRoom({ roomId, inputPassword }));
  }, [dispatch, roomId, inputPassword, user]);

  const onToggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };
  useEffect(() => {
    if (autoScroll) {
      scollToRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [loading, chats]);

  useEffect(() => {
    const socket = io.connect("pangtestserver.iptime.org/chat", {
      // 네임스페이스
      path: "/socket.io",
    });

    socket.emit("join", { roomId, User: user });
    socket.on("join", function (data) {
      //다른사람 입장시
      const newChat = data.chat;
      dispatch(concatChats({ newChat }));
      const onlines = data.Onlines;
      dispatch(listOnlines({ onlines }));
    });
    socket.on("exit", function (data) {
      // 누군가 퇴장
      const newChat = data.chat;
      dispatch(concatChats({ newChat }));
      const onlines = data.Onlines;
      dispatch(listOnlines({ onlines }));
    });
    socket.on("chat", function (data) {
      // 누군가 채팅
      const newChat = data.chat;
      dispatch(concatChats({ newChat }));
    });

    return () => {
      socket.disconnect(); //언마운트시 chat 네임스페이스 접속 해제
    };
  }, []);

  return (
    <>
      <div ref={scollToRef}>
        <Chat
          room={room}
          chats={chats}
          user={user}
          onlines={onlines}
          loading={loading}
          error={error}
          onToggleAutoScroll={onToggleAutoScroll}
        />
      </div>
    </>
  );
};

export default ChatContainer;
