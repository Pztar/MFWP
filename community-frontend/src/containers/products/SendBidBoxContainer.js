import { useState } from "react";
import { useParams } from "react-router-dom";
import SendBidBox from "../../components/products/SendBidBox";
import { bid as sendBid } from "../../lib/api/products";

const SendBidBoxContainer = () => {
  const params = useParams();
  const { productId } = params;
  const [bid, setbid] = useState("");
  const [msg, setMsg] = useState("");
  const [alret, setAlret] = useState(null);

  const onChangeField = (e) => {
    if (e.target.name === "bid") {
      setbid(e.target.value);
    }
    if (e.target.name === "msg") {
      setMsg(e.target.value);
    }
  };

  const onSend = (e) => {
    sendBid({ productId, bid, msg }).then(
      (result) => {
        setAlret(result.data);
        setbid("");
        setMsg("");
        setTimeout(() => {
          setAlret(null);
        }, 5000);
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
      alret={alret}
    />
  );
};

export default SendBidBoxContainer;
