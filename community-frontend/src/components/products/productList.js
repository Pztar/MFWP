import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useEffect, useState } from "react";
import useScript from "../../useScript";

const ProductLitstBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
  }

  th {
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }
`;

const RegistProductButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
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

  &:last-child {
    padding-top: 0;
  }

  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette[6]};
    }
  }

  p {
    margin-top: 2rem;
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
      <td>
        <Link to={`/acution/${productId}`}>입장</Link>
      </td>
    </ProductItemBlock>
  );
};

const ProductList = ({ products, loading, error, showRegistProductButton }) => {
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
    return <ProductLitstBlock>에러가 발생했습니다.</ProductLitstBlock>;
  }
  const ServerTime = Date(serverTime);
  const timeToLocale = ServerTime.toLocaleString("en-ZA", { hour12: true });

  return (
    <ProductLitstBlock>
      {/*<div>서버시간: {timeToLocale}</div>*/}
      <RegistProductButtonWrapper>
        {showRegistProductButton && (
          <Button cyan to="/resistProduct">
            상품등록
          </Button>
        )}
      </RegistProductButtonWrapper>
      {!loading && products && (
        <table>
          <thead>
            <ProductItemBlock>
              <th>판매자</th>
              <th>상품명</th>
              <th className="tdImg">이미지</th>
              <th className="tdLink">설명(링크)</th>
              <th>시작 가격</th>
              <th className="tdImg">잔여 시간</th>
              <th>입장</th>
            </ProductItemBlock>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.id}
                serverTime={serverTime}
              />
            ))}
          </tbody>
        </table>
      )}
    </ProductLitstBlock>
  );
};

export default ProductList;
