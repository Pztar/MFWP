import { useState } from "react";
import { useParams } from "react-router-dom";
import SendBidBox from "../../components/products/SendBidBox";
import { bid } from "../../lib/api/products";

const SendBidBoxContainer = () => {
  const params = useParams();
  const { productId } = params;
  const [bidTxt, setbidTxt] = useState("");
  const [msgTxt, setMsgTxt] = useState("");

  const onChangeChatTxt = (e) => {
    setbidTxt(e.target.value);
    setMsgTxt(e.target.value);
  };

  const onSend = (e) => {
    bid({ productId, bidTxt, msgTxt }).then(
      (result) => {
        setbidTxt("");
        setMsgTxt("");
      },
      (e) => {
        console.log("에러발생");
      }
    );
  };

  return (
    <SendBidBox
      bidTxt={bidTxt}
      msgTxt={msgTxt}
      onChangeChatTxt={onChangeChatTxt}
      onSend={onSend}
    />
  );
};

export default SendBidBoxContainer;
