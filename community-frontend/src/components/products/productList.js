import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useEffect, useState } from "react";

const Spacer = styled.div`
  height: 1rem;
`;

const ProductLitstBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
    border-collapse: collapse;

    th {
      width: auto;
      border: solid 1px black;
      padding: 3px 1px 3px 1px;
    }
    td {
      height: 30px;
      border: solid 1px black;
      text-align: center;
      vertical-align: middle;
    }
  }
`;

const RegistProductButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.2rem;
  margin-bottom: 5px;
  button {
    white-space: nowrap;
  }
`;

const ProductItemBlock = styled.tr`
  border: solid 1px black;
  width: 100%;
`;

const ProductItem = ({ product, serverTime, logedIn, setSoldList }) => {
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
    Sold,
  } = product;
  let linkUrl = "";
  if (/^https?:\/\//.test(explanation)) {
    linkUrl = explanation;
  } else {
    linkUrl = "http://" + explanation;
  }
  const productId = id;
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
  if (Sold) {
    setSoldList(true);
  } else {
    setSoldList(false);
  }
  return (
    <ProductItemBlock>
      <td>
        <Link
          to={`/posts/${OwnerId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {Owner.nick}
        </Link>
      </td>
      <td>{name}</td>
      <td>{category}</td>
      <td>{img ? <img src={`${img}`} alt="productImg" /> : "null"}</td>
      <td className="hideOverflow">
        {explanation ? (
          <a href={`${linkUrl}`} target="_blank" rel="noopener noreferrer">
            {explanation}
          </a>
        ) : (
          "링크가 없습니다."
        )}
      </td>
      <td>{price}</td>
      <td>{restTime}</td>
      <td>
        {logedIn ? (
          <Link to={`/auction/${productId}`} target="_blank">
            입장
          </Link>
        ) : (
          "로그인 필요"
        )}
      </td>
      {Sold && <td>{Sold.nick}</td>}
    </ProductItemBlock>
  );
};

const ProductList = ({
  products,
  loading,
  error,
  showRegistProductButton,
  serverTime,
}) => {
  const [soldList, setSoldList] = useState(false);
  const ServerTime = new Date(parseInt(serverTime, 10));
  const timeToLocale = ServerTime.toLocaleString("en-ZA", { hour12: true });

  if (error) {
    console.log(error);
    return <ProductLitstBlock>에러가 발생했습니다.</ProductLitstBlock>;
  }

  return (
    <ProductLitstBlock>
      <span>서버시간: {timeToLocale}</span>
      <RegistProductButtonWrapper>
        {!soldList ? (
          <Button
            cyan
            to="/auction?userId=0"
            onClick={(e) => setSoldList(true)}
          >
            낙찰 목록
          </Button>
        ) : (
          <Button cyan to="/auction">
            진행 목록
          </Button>
        )}
        {showRegistProductButton && (
          <Button cyan to="/resistProduct" target="_blank">
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
              <th>카테고리</th>
              <th>이미지</th>
              <th>설명(링크)</th>
              <th>시작 가격</th>
              <th>잔여 시간</th>
              <th>입장</th>
              {soldList && <th className="hideOverflow">구매자</th>}
            </ProductItemBlock>
          </thead>
          <tbody>
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.id}
                serverTime={serverTime}
                logedIn={showRegistProductButton}
                setSoldList={setSoldList}
              />
            ))}
          </tbody>
        </table>
      )}
      <Spacer />
    </ProductLitstBlock>
  );
};

export default ProductList;
