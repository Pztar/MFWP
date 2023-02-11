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

const ChatItemBlock = styled.tr`
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
        <td></td>
        <td></td>
        <td>{User.nick}</td>
      </ChatItemBlock>
    </>
  );
};

const Chat = ({ chats, loading, error, createRoomButton }) => {
  if (error) {
    return <ChatBlock>에러가 발생했습니다.</ChatBlock>;
  }

  return (
    <>
      <ChatBlock>
        <CreateRoomButtonWrapper>
          {<Button>채팅방 만들기</Button>}
        </CreateRoomButtonWrapper>
        <table>
          <thead>
            <tr>
              <th>방 제목</th>
              <th>종류</th>
              <th>허용 인원</th>
              <th>방장</th>
            </tr>
          </thead>
          {!loading && chats && (
            <tbody>
              {chats.map((chat) => (
                <ChatItem chat={chat} key={chat._id} />
              ))}
            </tbody>
          )}
        </table>
      </ChatBlock>
    </>
  );
};

export default Chat;
