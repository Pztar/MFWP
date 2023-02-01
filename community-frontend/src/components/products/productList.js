import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";
import useScript from "../../useScript";

const ProductLitstBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
  }

  th {
    flex: 1;
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }

  .tdImg {
    flex: 1.5;
  }

  .tdLink {
    flex: 2;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  justify-items: stretch;
  width: 100%;
  padding: 3px 1px 3px 1px;
  td {
    flex: 1;
    border: solid 1px black;
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
        <Link to={`/${OwnerId}`} target="_blank" rel="noopener noreferrer">
          {OwnerNick}
        </Link>
      </td>
      <td>{name}</td>
      <td className="tdImg">
        <img src={`/img/${img}`} alt="productImg" />
      </td>
      <td className="tdLink">
        <Link to={`${explanation}`} target="_blank" rel="noopener noreferrer">
          {explanation}
        </Link>
      </td>
      <td>{price}</td>
      <td>{restTime}</td>
      <td>
        <Link to={`/acution/${productId}`}>입장</Link>
      </td>
    </ProductItemBlock>
  );
};

const ProductList = ({ products, loading, error, showRegistProductButton }) => {
  useScript("https://unpkg.com/event-source-polyfill/src/eventsource.min.js");
  const [serverTime, setServerTime] = useState(new Date());
  /*const es = new EventSource("/sse");
  es.onmessage = function (e) {
    setServerTime(new Date(parseInt(e.data, 10)));
  };*/

  if (error) {
    return <ProductLitstBlock>에러가 발생했습니다.</ProductLitstBlock>;
  }

  return (
    <ProductLitstBlock>
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
              <th>잔여 시간</th>
              <th>입장</th>
            </ProductItemBlock>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.id}
                server={serverTime}
              />
            ))}
          </tbody>
        </table>
      )}
    </ProductLitstBlock>
  );
};

export default ProductList;
