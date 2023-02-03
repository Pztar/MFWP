import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useEffect, useState } from "react";
import useScript from "../../useScript";

const AuctionBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
  }

  th {
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }
`;

const SendButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  margin-bottom: 5px;
`;

const ProductItemBlock = styled.tr`
  border: solid 1px black;
  width: 100%;
  td {
    height: 30px;
    border: solid 1px black;
    border-collapse: collapse;
    text-align: center;
    vertical-align: middle;
    img {
      height: 100px;
      padding: 0px;
      vertical-align: top;
    }
  }
`;
const AuctionItemBlock = styled.div`
  border: solid 1px black;
  width: 100%;
  td {
    height: 30px;
    border: solid 1px black;
    border-collapse: collapse;
    text-align: center;
    vertical-align: middle;
    img {
      height: 100px;
      padding: 0px;
      vertical-align: top;
    }
  }
`;

const ProductItem = ({ product, serverTime }) => {
  const {
    id,
    name,
    category,
    img,
    explanation,
    price,
    terminatedAt,
    createdAt,
    OwnerId,
    Owner,
  } = product;
  const productId = id;
  const OwnerNick = Owner.nick;
  const end = new Date(terminatedAt); // 경매 종료 시간
  let restTime = "00d00:00:00";
  if (serverTime >= end) {
    // 경매가 종료되었으면
    restTime = "종료";
  } else {
    const t = end - serverTime; // 경매 종료까지 남은 시간
    const seconds = ("0" + Math.floor((t / 1000) % 60)).slice(-2);
    const minutes = ("0" + Math.floor((t / 1000 / 60) % 60)).slice(-2);
    const hours = ("0" + Math.floor((t / (1000 * 60 * 60)) % 24)).slice(-2);
    const days = ("0" + Math.floor(t / (1000 * 60 * 60 * 24))).slice(-2);
    restTime = days + "d" + hours + ":" + minutes + ":" + seconds;
  }
  return (
    <ProductItemBlock>
      <td>
        <Link
          to={`/posts/${OwnerId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {OwnerNick}
        </Link>
      </td>
      <td>{name}</td>
      <td>{category}</td>
      <td className="tdImg">
        {img ? <img src={`${img}`} alt="productImg" /> : "null"}
      </td>
      <td className="tdLink">
        {explanation ? (
          <a
            href={`http://${explanation}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {explanation}
          </a>
        ) : (
          "링크가 없습니다."
        )}
      </td>
      <td>{price}</td>
      <td className="tdImg">{restTime}</td>
    </ProductItemBlock>
  );
};

const AuctionItem = ({ auction }) => {
  const { id, bid, msg, createdAt, User } = auction;

  return (
    <AuctionItemBlock>
      <div>{new Date(createdAt).toLocaleString("en-ZA", { hour12: true })}</div>
      <span>{User.nick}님: </span>
      <strong>{bid}원에 입찰하셨습니다.</strong>
      {msg ? <span>{msg}</span> : <span />}
    </AuctionItemBlock>
  );
};

const Auction = ({ product, auctions, loading, error }) => {
  useScript("https://unpkg.com/event-source-polyfill/src/eventsource.min.js");

  const [listening, setListening] = useState(false);
  const [serverTime, setServerTime] = useState(null);

  let es = undefined;
  useEffect(() => {
    if (!listening) {
      es = new EventSource("/sse");
      es.onopen = (event) => {
        console.log("connection opened");
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

  if (error) {
    console.log(error);
    return <AuctionBlock>에러가 발생했습니다.</AuctionBlock>;
  }
  const ServerTime = new Date(parseInt(serverTime, 10));
  const timeToLocale = ServerTime.toLocaleString("en-ZA", { hour12: true });

  return (
    <AuctionBlock>
      <span>서버시간: {timeToLocale}</span>
      <table>
        <thead>
          <ProductItemBlock>
            <th>판매자</th>
            <th>상품명</th>
            <th>카테고리</th>
            <th className="tdImg">이미지</th>
            <th className="tdLink">설명(링크)</th>
            <th>시작 가격</th>
            <th className="tdImg">잔여 시간</th>
          </ProductItemBlock>
        </thead>
        <tbody>
          {!loading && product && (
            <ProductItem
              product={product}
              key={product.id}
              serverTime={serverTime}
            />
          )}
        </tbody>
      </table>
      {!loading && auctions && (
        <div>
          {auctions.map((auction) => (
            <AuctionItem auction={auction} key={auction.id} />
          ))}
        </div>
      )}
    </AuctionBlock>
  );
};

export default Auction;
