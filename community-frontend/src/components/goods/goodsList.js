import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";
import useScript from "../../useScript";

const GoodsLitstBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const RegistGoodButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
`;

const GoodItemBlock = styled.tr`
  padding-top: 3rem;
  padding-bottom: 3rem;
  &:first-child {
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

const GoodItem = ({ good, serverTime }) => {
  const {
    id,
    name,
    category,
    img,
    explanation,
    price,
    TerminatedAt,
    createdAt,
    OwnerId,
    User,
  } = good;
  const goodId = id;
  const userId = OwnerId;
  const end = new Date(TerminatedAt); // 경매 종료 시간
  let restTime = "00d00:00:00";
  if (serverTime >= end) {
    // 경매가 종료되었으면
  } else {
    const t = end - serverTime; // 경매 종료까지 남은 시간
    const seconds = ("0" + Math.floor((t / 1000) % 60)).slice(-2);
    const minutes = ("0" + Math.floor((t / 1000 / 60) % 60)).slice(-2);
    const hours = ("0" + Math.floor((t / (1000 * 60 * 60)) % 24)).slice(-2);
    const days = ("0" + Math.floor(t / (1000 * 60 * 60 * 24))).slice(-2);
    restTime = days + "d" + hours + ":" + minutes + ":" + seconds;
  }
  return (
    <GoodItemBlock>
      <td>{name}</td>
      <td>
        <img src={`/img/${img}`} alt="goodImg" />
      </td>
      <td>
        <Link to={`${explanation}`} target="_blank" rel="noopener noreferrer">
          {explanation}
        </Link>
      </td>
      <td>{price}</td>
      <td>{restTime}</td>
      <td>
        <Link to={`/acution/${goodId}`}>입장</Link>
      </td>
    </GoodItemBlock>
  );
};

const GoodList = ({ goods, loading, error, showRegistGoodButton }) => {
  useScript("https://unpkg.com/event-source-polyfill/src/eventsource.min.js");
  const [serverTime, setServerTime] = useState(new Date());
  const es = new EventSource("/sse");
  es.onmessage = function (e) {
    setServerTime(new Date(parseInt(e.data, 10)));
  };

  if (error) {
    return <GoodsLitstBlock>에러가 발생했습니다.</GoodsLitstBlock>;
  }

  return (
    <GoodsLitstBlock>
      <RegistGoodButtonWrapper>
        {showRegistGoodButton && (
          <Button cyan to="/resistGood">
            상품등록
          </Button>
        )}
      </RegistGoodButtonWrapper>
      {!loading && goods && (
        <table>
          <tr>
            <th>상품명</th>
            <th>이미지</th>
            <th>설명(링크)</th>
            <th>시작 가격</th>
            <th>잔여 시간</th>
            <th>입장</th>
          </tr>
          {goods.map((good) => (
            <GoodItem good={good} key={good.id} server={serverTime} />
          ))}
        </table>
      )}
    </GoodsLitstBlock>
  );
};

export default GoodList;
