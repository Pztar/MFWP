import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import ToggleSwitch from "../common/ToggleSwitch";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: ${palette.gray[0]};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);
  padding-bottom: 0.3rem;
`;

const Wrapper = styled(Responsive)`
  height: auto;
  margin-top: 0.3rem;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.3rem;

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
      img {
        height: 100px;
        padding: 0px;
        vertical-align: top;
      }
    }
  }
`;

const TopSpacer = styled.div`
  height: 6.5rem;
`;
const BottomSpacer = styled.div`
  height: 3.5rem;
`;

const ToggleSwitchBlock = styled.div`
  display: flex;
  align-items: center;
`;

const AuctionBlock = styled(Responsive)`
  .system {
    justify-content: center;
  }

  .myChat {
    justify-content: end;
  }

  .othersChat {
    justify-content: start;
  }
`;

const ProductItemBlock = styled.tr`
  border: solid 1px black;
  width: 100%;
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
  let linkUrl = "";
  if (/^https?:\/\//.test(explanation)) {
    linkUrl = explanation;
  } else {
    linkUrl = "http://" + explanation;
  }

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
          <a href={`${linkUrl}`} target="_blank" rel="noopener noreferrer">
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

const AuctionItemBlock = styled.div`
  display: flex;
  width: auto;

  .system {
  }

  .myChat {
    background-color: ${palette.gray[5]};
  }

  .othersChat {
    background-color: ${palette.gray[3]};
  }
`;

const ChatBubble = styled.div`
  display: inline-block;
  margin-top: 0.5rem;
  border-radius: 10px;
  padding: 0.5rem;

  .chatNick {
    font-weight: bold;
  }
  img {
    padding: 0.5rem 0.25rem 0.2rem; //top right&left bottom
  }
`;

const AuctionItem = ({ auction, user }) => {
  const { id, bid, msg, createdAt, User } = auction;

  return (
    <AuctionItemBlock
      className={
        User.id === 0
          ? "system"
          : user.nick === User.nick
          ? "myChat"
          : "othersChat"
      }
    >
      <ChatBubble
        className={
          User.id === 0
            ? "system"
            : user.nick === User.nick
            ? "myChat"
            : "othersChat"
        }
      >
        <div>
          {new Date(createdAt).toLocaleString("en-ZA", { hour12: true })}
        </div>
        <span>{User.nick}님: </span>
        <div>입찰가: {bid}</div>
        {msg ?? <div>{msg}</div>}
      </ChatBubble>
    </AuctionItemBlock>
  );
};

const Auction = ({
  product,
  auctions,
  point,
  loading,
  error,
  user,
  serverTime,
  onToggleAutoScroll,
}) => {
  const ServerTime = new Date(parseInt(serverTime, 10));
  const timeToLocale = ServerTime.toLocaleString("en-ZA", { hour12: true });
  const pointToString = parseInt(point, 10).toLocaleString();
  //point.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (error) {
    console.log(error);
    return <AuctionBlock>에러가 발생했습니다.</AuctionBlock>;
  }

  return (
    <>
      <HeaderBlock>
        <Wrapper>
          <div>
            <span>서버시간: {timeToLocale}</span>
            <span>보유포인트: {pointToString}</span>
            <ToggleSwitchBlock>
              <div>autoScroll</div>
              <ToggleSwitch
                left="on"
                right="off"
                leftColor={null}
                rightColor={null}
                leftBgColor={null}
                rightBgColor={null}
                circleColor={null}
                setChecked={onToggleAutoScroll}
              />
            </ToggleSwitchBlock>
          </div>
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
              {!loading && product && (
                <ProductItem
                  product={product}
                  key={product.id}
                  serverTime={serverTime}
                />
              )}
            </thead>
          </table>
        </Wrapper>
      </HeaderBlock>
      <TopSpacer />
      <AuctionBlock>
        {!loading && auctions && (
          <div>
            {auctions.map((auction) => (
              <AuctionItem auction={auction} user={user} key={auction.id} />
            ))}
          </div>
        )}
        <BottomSpacer />
      </AuctionBlock>
    </>
  );
};

export default Auction;
