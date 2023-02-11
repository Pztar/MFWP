import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../../modules/createRoom";
import CreateRoomButton from "../../components/chat/CreateRoomButton";

const CreateRoomButtonContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { title, max, password, room, roomError } = useSelector(({ room }) => ({
    title: room.title,
    max: room.max,
    password: room.password,
    room: room.room,
    roomError: room.roomError,
  }));
  const onPublish = () => {
    dispatch(createRoom({ title, max, password }));
  };

  useEffect(() => {
    if (room) {
      const { _id, password } = room;
      console.log(room);
      navigate(`/chat/${_id}/?password=${password}`);
    }
    if (roomError) {
      console.log(roomError);
    }
  }, [room, roomError, navigate]);

  return <CreateRoomButton onPublish={onPublish} />;
};

export default CreateRoomButtonContainer;
