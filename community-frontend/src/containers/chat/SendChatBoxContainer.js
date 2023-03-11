import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SendChatBox from "../../components/chat/SendChatBox";
import { sendChat } from "../../lib/api/rooms";

const SendChatBoxContainer = () => {
  const params = useParams();
  const { roomId } = params;
  const [imgUrl, setImgUrl] = useState("");
  const [chatTxt, setChatTxt] = useState("");
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

  const onChangeChatTxt = (e) => {
    setChatTxt(e.target.value);
  };

  const onSend = (e) => {
    if (imgUrl || chatTxt) {
      sendChat({ roomId, imgUrl, chatTxt }).then(
        (result) => {
          setImgUrl("");
          setChatTxt("");
        },
        (e) => {
          console.log("에러발생");
        }
      );
    }
  };

  if (error) {
    return <div></div>;
  }

  return (
    <SendChatBox
      imgUrl={imgUrl}
      setImgUrl={setImgUrl}
      chatTxt={chatTxt}
      onChangeChatTxt={onChangeChatTxt}
      onSend={onSend}
    />
  );
};

export default SendChatBoxContainer;
