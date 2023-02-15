import { useState } from "react";
import SendChatButton from "../../components/chat/SendChatButton";

const SendChatButtonContainer = () => {
  const [imgUrl, setImgUrl] = useState("");
  const [chatTxt, setChatTxt] = useState("");

  const onChangeImgUrl = (e) => {
    setImgUrl(e.target.value);
  };
  const onChangeChatTxt = (e) => {
    setChatTxt(e.target.value);
  };

  return (
    <SendChatButton
      imgUrl={imgUrl}
      chatTxt={chatTxt}
      setImgUrl={setImgUrl}
      onChangeChatTxt={onChangeChatTxt}
    />
  );
};

export default SendChatButtonContainer;
