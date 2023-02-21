import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import { useState } from "react";
//import Tags from "../common/Tags";
const Spacer = styled.div`
  height: 1rem;
`;

const RoomLitstBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
    border-collapse: collapse; //태두리 간격
  }

  th {
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }
  td {
    height: 30px;
    border: solid 1px black;
    text-align: center;
    vertical-align: middle;
  }
`;

const PromptBlock = styled.div`
  background: none; //${palette.gray[3]};
  padding-left: 5px;
  width: auto;
  height: auto;
  position: relative;
  //top: 10%;
  //left: 50%;
  //transform: translateX(-50%);
  border-radius: 5px;
  input {
    font-size: 1rem;
    padding: 0.1rem 0.5rem;
  }
  Button {
    justify-self: end;
    margin: 3px;
    font-size: 0.9rem;
  }
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
      <span>┗ </span>
      <input
        placeholder="비밀번호를 입력하세요"
        onChange={onChangePassword}
        value={inputPassword}
      />
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
`;

const RoomItem = ({ room, loggedIn }) => {
  const { _id, title, max, Owner, password, createdAt } = room;
  const roomId = _id;
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

  return (
    <>
      <RoomItemBlock>
        <td>
          {loggedIn ? (
            password ? (
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
            )
          ) : (
            <div>{title}</div>
          )}
        </td>
        <td>{password ? "비밀방" : "공개방"}</td>
        <td>{max}</td>
        <td>{Owner.nick}</td>
      </RoomItemBlock>
      {showPrompt ? (
        <tr>
          <td colSpan={4}>
            <Prompt onClosePrompt={onClosePrompt} LinkedRoomId={LinkedRoomId} />
          </td>
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};

const ChatRoomList = ({ rooms, loading, error, loggedIn }) => {
  if (error) {
    return <RoomLitstBlock>에러가 발생했습니다.</RoomLitstBlock>;
  }

  return (
    <>
      <RoomLitstBlock>
        <CreateRoomButtonWrapper>
          {loggedIn ? (
            <Button cyan to="/chat/createRoom" target="_blank">
              채팅방 만들기
            </Button>
          ) : (
            <div>로그인해야 입장 가능합니다</div>
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
                <RoomItem room={room} key={room._id} loggedIn={loggedIn} />
              ))}
            </tbody>
          )}
        </table>
      </RoomLitstBlock>
      <Spacer />
    </>
  );
};

export default ChatRoomList;
