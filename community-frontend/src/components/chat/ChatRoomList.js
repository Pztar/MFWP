import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";
//import Tags from "../common/Tags";

const RoomLitstBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
  }

  th {
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }
`;

const PromptBlock = styled.div`
  background: ${palette.gray[5]};
  padding: 10px 10px 10px 10px;
  width: auto;
  height: auto;
  position: absolute;
  border-radius: 5px;
`;

const Prompt = ({ onClosePrompt, LinkedRoomId }) => {
  const [inputPassword, setInputPassword] = useState("");
  const onChangePassword = (e) => {
    setInputPassword(e.target.value);
  };
  const onMove = () => {
    window.open(
      `http://localhost:3000/chat/${LinkedRoomId}?password=${inputPassword}`,
      "_blank"
    );
  };

  return (
    <PromptBlock>
      <div>"비밀번호를 입력하세요"</div>
      <input onChange={onChangePassword} value={inputPassword} />
      <Button onClick={onMove}>확인</Button>
      <Button
        onClick={(e) => {
          onClosePrompt(e, setInputPassword);
        }}
      >
        취소
      </Button>
    </PromptBlock>
  );
};

const CreateRoomButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
  margin-bottom: 5px;
`;

const RoomItemBlock = styled.tr`
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

const RoomItem = ({ room, onOpenPrompt }) => {
  const { _id, title, max, Owner, password, createdAt } = room;
  const roomId = _id;

  return (
    <RoomItemBlock>
      <td>
        {password ? (
          <Link
            onClick={(e) => {
              onOpenPrompt(e, roomId); //이벤트 핸들러에 event 객체 외의 파라미터를 넘겨주는 방법
            }}
          >
            {title}
          </Link>
        ) : (
          <Link
            to={`/chat/${roomId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </Link>
        )}
      </td>
      <td>{password ? "비밀방" : "공개방"}</td>
      <td>{max}</td>
      <td>{Owner.nick}</td>
    </RoomItemBlock>
  );
};

const ChatRoomList = ({ rooms, loading, error, createRoomButton }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [LinkedRoomId, setLinkedRoomId] = useState("");
  const onOpenPrompt = (e, roomId) => {
    setShowPrompt(true);
    setLinkedRoomId(roomId);
  };
  const onClosePrompt = (e, setInputPassword) => {
    setShowPrompt(false);
    setLinkedRoomId("");
    setInputPassword("");
  };

  if (error) {
    return <RoomLitstBlock>에러가 발생했습니다.</RoomLitstBlock>;
  }

  return (
    <RoomLitstBlock>
      {showPrompt ? (
        <Prompt onClosePrompt={onClosePrompt} LinkedRoomId={LinkedRoomId} />
      ) : (
        <></>
      )}
      <CreateRoomButtonWrapper>
        {createRoomButton && (
          <Button cyan to="/chat/createRoom" target="_blank">
            채팅방 만들기
          </Button>
        )}
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
        {!loading && rooms && (
          <tbody>
            {rooms.map((room) => (
              <RoomItem
                room={room}
                key={room._id}
                onOpenPrompt={onOpenPrompt}
              />
            ))}
          </tbody>
        )}
      </table>
    </RoomLitstBlock>
  );
};

export default ChatRoomList;
