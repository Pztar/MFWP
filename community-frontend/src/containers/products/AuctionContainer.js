import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  concatAuction,
  readProduct,
  unloadProduct,
} from "../../modules/product";
import Auction from "../../components/products/Auction";
import { useCallback, useEffect, useRef, useState } from "react";
import useScript from "../../useScript";
import io from "socket.io-client";

const AuctionContainer = () => {
  const scollToRef = useRef();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { product, auctions, point, error, loading, user } = useSelector(
    ({ product, loading, user }) => ({
      product: product.product,
      auctions: product.auctions,
      point: product.point,
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
  }, [productId]);

  useScript("https://unpkg.com/event-source-polyfill/src/eventsource.min.js");

  const [serverTime, setServerTime] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const onToggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };
  useEffect(() => {
    if (autoScroll) {
      scollToRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [loading, auctions]);

  useEffect(() => {
    const es = new EventSource("/sse");
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

    const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}/auction`, {
      //pangtestserver.iptime.org로 접속해야함
      // 네임스페이스
      path: "/socket.io",
      transports: ["websocket"],
    });
    socket.emit("join", { productId, User: user });
    socket.on("bid", function (data) {
      // 누군가 채팅
      dispatch(concatAuction(data));
    });

    return () => {
      es.close();
      console.log("eventsource closed");
      socket.disconnect(); //언마운트시 auction 네임스페이스 접속 해제
    };
  }, []);

  return (
    <div ref={scollToRef}>
      <Auction
        loading={loading}
        error={error}
        product={product}
        auctions={auctions}
        point={point}
        user={user}
        serverTime={serverTime}
        onToggleAutoScroll={onToggleAutoScroll}
      />
    </div>
  );
};

export default AuctionContainer;
