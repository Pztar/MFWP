import { useState } from "react";
import { useParams } from "react-router-dom";
import SendChatBox from "../../components/chat/SendChatBox";
import { sendChat } from "../../lib/api/rooms";

const SendChatBoxContainer = () => {
  const params = useParams();
  const { roomId } = params;
  const [imgUrl, setImgUrl] = useState("");
  const [chatTxt, setChatTxt] = useState("");

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
