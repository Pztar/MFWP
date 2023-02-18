import { useState } from "react";
import { useParams } from "react-router-dom";
import SendBidBox from "../../components/products/SendBidBox";
import { bid as sendBid } from "../../lib/api/products";

const SendBidBoxContainer = () => {
  const params = useParams();
  const { productId } = params;
  const [bid, setbid] = useState("");
  const [msg, setMsg] = useState("");

  const onChangeField = (e) => {
    if (e.target.name === "bid") {
      setbid(e.target.value);
    }
    if (e.target.name === "msg") {
      setMsg(e.target.value);
    }
  };

  const onSend = (e) => {
    console.log("@@@", productId, bid, msg);
    sendBid({ productId, bid, msg }).then(
      (result) => {
        setbid("");
        setMsg("");
      },
      (e) => {
        console.log("에러발생");
      }
    );
  };

  return (
    <SendBidBox
      bid={bid}
      msg={msg}
      onChangeField={onChangeField}
      onSend={onSend}
    />
  );
};

export default SendBidBoxContainer;
