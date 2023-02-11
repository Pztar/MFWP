import { useDispatch, useSelector } from "react-redux";
import CreateRoom from "../../components/chat/CreateRoom";
import { changeField, createRoom, initialize } from "../../modules/createRoom";

const CreateRoomContainer = () => {
  const dispatch = useDispatch();
  const { title, max, password, room, roomError } = useSelector(({ room }) => ({
    title: room.title,
    max: room.max,
    password: room.password,
    room: room.room,
    roomError: room.roomError,
  }));

  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        key: name,
        value,
      })
    );
  };

  return (
    <CreateRoom
      onChange={onChange}
      title={title}
      max={max}
      password={password}
    />
  );
};

export default CreateRoomContainer;
