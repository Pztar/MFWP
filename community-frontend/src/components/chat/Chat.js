import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";

const ChatBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
  }

  th {
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }
`;

const CreateRoomButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
  margin-bottom: 5px;
`;

const ChatItemBlock = styled.div`
  border: solid 1px black;
  width: 100%;
  td {
    height: 30px;
    border: solid 1px black;
    border-collapse: collapse;
    text-align: center;
    vertical-align: middle;
  }
`;

const ChatItem = ({ chatlog }) => {
  const { _id, Room, User, chat, gif, createdAt } = chatlog;
  const roomId = _id;

  return (
    <>
      <ChatItemBlock>
        <div>{User.nick}</div>
      </ChatItemBlock>
    </>
  );
};

const Chat = ({ room, chats, user, onlines, error, loading }) => {
  if (error) {
    return <ChatBlock>에러가 발생했습니다.</ChatBlock>;
  }

  return (
    <>
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
              <ChatItem chatlog={chatlog} key={chatlog._id} />
            ))}
          </div>
        )}
      </ChatBlock>
    </>
  );
};

export default Chat;
