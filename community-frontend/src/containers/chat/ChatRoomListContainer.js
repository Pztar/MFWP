import ChatRoomList from "../../components/chat/ChatRoomList";
import { useEffect } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { listRooms } from "../../modules/rooms";

const ChatRoomListContainer = () => {
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
    const { userId } = params;
    const { page } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });

    dispatch(listRooms({ page, userId }));
  }, [dispatch, search, params]);

  return (
    <ChatRoomList
      loading={loading}
      error={error}
      rooms={rooms}
      createRoomButton={user}
    />
  );
};

export default ChatRoomListContainer;
