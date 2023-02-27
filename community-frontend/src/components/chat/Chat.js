import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";
import ToggleSwitch from "../common/ToggleSwitch";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: ${palette.gray[1]};
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);

  div {
    span + span {
      ::before {
        content: " / ";
      }
    }
  }
`;

const Wrapper = styled(Responsive)`
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

const TopSpacer = styled.div`
  height: 2rem;
`;

const ToggleSwitchBlock = styled.div`
  display: flex;
  align-items: center;
`;

const ChatBlock = styled(Responsive)`
  margin-top: 1rem;
  .system {
    justify-content: center;
    text-align: center;
  }

  .myChat {
    justify-content: end;
  }

  .othersChat {
    justify-content: start;
  }
`;

const Spacer = styled.div`
  height: 6rem;
`;

const ChatItemBlock = styled.div`
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
  max-width: 80%;

  .chatNick {
    font-weight: bold;
  }
  img {
    padding: 0.5rem 0.25rem 0.2rem; //top right&left bottom
    max-width: 100%;
  }
  .timeStamp {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

const ChatItem = ({ chatlog, user }) => {
  const { _id, Room, User, chat, img, createdAt } = chatlog;
  const roomId = _id;
  const timeStamp = new Date(createdAt).toLocaleString("en-ZA", {
    hour12: true,
  });

  return (
    <ChatItemBlock
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
        <span>
          <div className="chatNick">{User.nick}</div>
          {img && <img src={img} alt="chatImg" />}
          {chat && <div>{chat}</div>}
          <div className="timeStamp">{timeStamp}</div>
        </span>
      </ChatBubble>
    </ChatItemBlock>
  );
};

const Chat = ({
  room,
  chats,
  user,
  onlines,
  error,
  loading,
  onToggleAutoScroll,
}) => {
  if (error) {
    return <ChatBlock>에러가 발생했습니다.</ChatBlock>;
  }

  return (
    <>
      <HeaderBlock>
        <Wrapper>
          {!loading && room && (
            <div>
              <span>방 제목: {room.title}</span>
              <span>최대인원: {room.max}</span>
              <span>방장: {room.Owner.nick}</span>
            </div>
          )}
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
        </Wrapper>
      </HeaderBlock>
      <TopSpacer />
      <ChatBlock>
        {!loading && chats && (
          <div>
            {chats.map((chatlog) => (
              <ChatItem chatlog={chatlog} key={chatlog._id} user={user} />
            ))}
          </div>
        )}
        <Spacer />
      </ChatBlock>
    </>
  );
};

export default Chat;
