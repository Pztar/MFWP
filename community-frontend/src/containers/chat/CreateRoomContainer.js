import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CreateRoom from "../../components/chat/CreateRoom";
import { changeField, createRoom, initialize } from "../../modules/createRoom";

const CreateRoomContainer = () => {
  const dispatch = useDispatch();
  const { title, max, password } = useSelector(({ room }) => ({
    title: room.title,
    max: room.max,
    password: room.password,
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

  const onPublish = () => {
    dispatch(createRoom({ title, max, password }));
  };

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return (
    <CreateRoom
      onChange={onChange}
      onPublish={onPublish}
      title={title}
      max={max}
      password={password}
    />
  );
};

export default CreateRoomContainer;
