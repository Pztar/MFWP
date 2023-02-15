import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";

const ChatBlock = styled(Responsive)`
  margin-top: 1rem;

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

const ChatItem = ({ chatlog, user }) => {
  const { _id, Room, User, chat, img, createdAt } = chatlog;
  const roomId = _id;

  return (
    <ChatItemBlock
      className={user.nick === User.nick ? "myChat" : "othersChat"}
    >
      <ChatBubble className={user.nick === User.nick ? "myChat" : "othersChat"}>
        <span>
          <div className="chatNick">{User.nick}</div>
          {img && <img src={img} alt="chatImg" />}
          {chat && <div>{chat}</div>}
        </span>
      </ChatBubble>
    </ChatItemBlock>
  );
};

const Chat = ({ room, chats, user, onlines, error, loading }) => {
  if (error) {
    return <ChatBlock>에러가 발생했습니다.</ChatBlock>;
  }

  return (
    <ChatBlock>
      {!loading && room && (
        <div>
          <span>{room.title}</span>
          <span>{room.max}</span>
          <span>{room.Owner.nick}</span>
        </div>
      )}
      {!loading && chats && (
        <div>
          {chats.map((chatlog) => (
            <ChatItem chatlog={chatlog} key={chatlog._id} user={user} />
          ))}
        </div>
      )}
      <Spacer />
    </ChatBlock>
  );
};

export default Chat;
