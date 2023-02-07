import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import { useState } from "react";
//import Tags from "../common/Tags";

const PromptBlock = styled.div`
  background: ${palette.gray[5]};
  padding: 5.5rem 10px 10px 10px;
  width: 200px;
  height: auto;
  position: absolute;
  border-radius: 5px;
`;

const Prompt = ({ onClosePrompt, LinkedRoomId }) => {
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();
  const onChangePassword = (e) => {
    setInputPassword(e.target.value);
  };
  const onMove = () => {
    navigate(`/chat/${LinkedRoomId}?password=${inputPassword}`);
  };

  return (
    <PromptBlock>
      <div>"비밀번호를 입력하세요"</div>
      <input onChange={onChangePassword} value={inputPassword} />
      <Button onClick={onMove}>확인</Button>
      <Button onClick={onClosePrompt}>취소</Button>
    </PromptBlock>
  );
};

const RoomLitstBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const CreateRoomButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
  margin-bottom: 5px;
`;

const RoomItemBlock = styled.tr`
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

const RoomItem = ({ room, onOpenPrompt }) => {
  const { _id, title, max, Owner, password, createdAt } = room;
  const roomId = _id;

  return (
    <RoomItemBlock>
      <td>
        {password ? (
          <Link onClick={onOpenPrompt(roomId)}>{title}</Link>
        ) : (
          <Link to={`/chat/${roomId}`}>{title}</Link>
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
  const onOpenPrompt = (roomId) => {
    setShowPrompt(true);
    setLinkedRoomId(roomId);
  };
  const onClosePrompt = () => {
    setShowPrompt(false);
    setLinkedRoomId("");
  };

  if (error) {
    return <RoomLitstBlock>에러가 발생했습니다.</RoomLitstBlock>;
  }

  return (
    <RoomLitstBlock>
      <CreateRoomButtonWrapper>
        {createRoomButton && (
          <Button cyan to="/chat/createRoom">
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
      {showPrompt ? (
        <Prompt onClosePrompt={onClosePrompt} LinkedRoomId={LinkedRoomId} />
      ) : (
        <></>
      )}
    </RoomLitstBlock>
  );
};

export default ChatRoomList;
