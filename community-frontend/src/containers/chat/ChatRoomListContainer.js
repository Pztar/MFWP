import ChatRoomList from "../../components/chat/ChatRoomList";
import { useEffect } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { listRooms, concatRooms, removeRoom } from "../../modules/rooms";
import io from "socket.io-client";

const ChatRoomListContainer = () => {
  const dispatch = useDispatch();
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
    const { page } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    dispatch(listRooms({ page }));

    const socket = io.connect("pangtestserver.iptime.org/room", {
      // 네임스페이스
      path: "/socket.io",
    });
    socket.on("newRoom", (data) => {
      // 새 방 이벤트 시 새 방 생성
      dispatch(concatRooms({ newRoom: data }));
    });
    socket.on("removeRoom", (data) => {
      // 방 제거 이벤트 시 id가 일치하는 방 제거
      dispatch(removeRoom({ roomId: data }));
    });
    return () => {
      socket.disconnect(); //언마운트시 room 네임스페이스 접속 해제
    };
  }, [dispatch, search]);

  return (
    <ChatRoomList
      loading={loading}
      error={error}
      rooms={rooms}
      loggedIn={user}
    />
  );
};

export default ChatRoomListContainer;
