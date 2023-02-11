import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";

const ButtonWrapper = styled(Responsive)`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  margin-bottom: 5px;
`;

const CreateRoomButton = ({ onPublish }) => {
  return (
    <ButtonWrapper>
      <Button onClick={onPublish}>채팅방 생성</Button>
      <Button
        onClick={(e) => {
          window.close();
        }}
      >
        취소
      </Button>
    </ButtonWrapper>
  );
};

export default CreateRoomButton;
