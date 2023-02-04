import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { readProduct, unloadProduct } from "../../modules/product";
import Auction from "../../components/auction/Auction";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { SocketContext } from "../../lib/api/socket";
import useScript from "../../useScript";

const AuctionContainer = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { product, auctions, error, loading, user } = useSelector(
    ({ product, loading, user }) => ({
      product: product.product,
      auctions: product.auctions,
      error: product.error,
      loading: loading["product/READ_PRODUCTS"],
      user: user.user,
    })
  );

  useEffect(() => {
    dispatch(readProduct(productId));
    return () => {
      dispatch(unloadProduct());
    };
  }, [dispatch, productId]);

  useScript("https://unpkg.com/event-source-polyfill/src/eventsource.min.js");

  const [messages, setMessages] = useState(auctions);
  const [listening, setListening] = useState(false);
  const [serverTime, setServerTime] = useState(null);

  let es = undefined;
  useEffect(() => {
    if (!listening) {
      es = new EventSource("/sse");
      es.onopen = (event) => {
        console.log("sse connection opened");
      };
      es.onmessage = function (e) {
        setServerTime(e.data);
      };
      es.onerror = (event) => {
        console.log(event.target.readyState);
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("eventsource closed (" + event.target.readyState + ")");
        }
        es.close();
      };

      setListening(true);
    }

    return () => {
      es.close();
      console.log("eventsource closed");
    };
  }, []);

  const chatWindow = useRef(null);
  const socket = useContext(SocketContext);
  // 새 메시지를 받으면 스크롤을 이동하는 함수
  const moveScrollToReceiveMessage = useCallback(() => {
    if (chatWindow.current) {
      chatWindow.current.scrollTo({
        top: chatWindow.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  // RECEIVE_MESSAGE 이벤트 콜백: messages state에 데이터를 추가합니다.
  const handleReceiveMessage = useCallback(
    (pongData) => {
      const newMessage = {
        id: pongData.id,
        bid: pongData.bid,
        msg: pongData.msg,
        createdAt: pongData.createdAt,
        User: { id: pongData.id, nick: pongData.nick },
      };
      setMessages((messages) => [...messages, newMessage]);
      moveScrollToReceiveMessage();
    },
    [moveScrollToReceiveMessage]
  );

  useEffect(() => {
    socket.on("bid", handleReceiveMessage); // 이벤트 리스너 설치

    return () => {
      socket.off("bid", handleReceiveMessage); // 이벤트 리스너 해제
    };
  }, [socket, handleReceiveMessage]);

  return (
    <Auction
      loading={loading}
      error={error}
      product={product}
      messages={messages}
      sendButton={user}
      serverTime={serverTime}
    />
  );
};

export default AuctionContainer;
