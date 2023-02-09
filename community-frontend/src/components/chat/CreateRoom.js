import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";

const CreateRoomBlock = styled(Responsive)`
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
  margin-bottom: 5px;
`;

const CreateRoom = ({ onChange, onPublish, title, max, password }) => {
  return (
    <CreateRoomBlock>
      <form>
        <StyledInput
          autoComplete="title"
          type="text"
          name="title"
          placeholder="방 제목"
          onChange={onChange}
          value={title}
        />
        <StyledInput
          autoComplete="max"
          type="number"
          name="max"
          placeholder="수용 인원(최소 2명)"
          min="2"
          onChange={onChange}
          value={max}
        />
        <StyledInput
          autoComplete="password"
          type="password"
          name="password"
          placeholder="비밀번호(없으면 공개방)"
          onChange={onChange}
          value={password}
        />
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
      </form>
    </CreateRoomBlock>
  );
};

export default CreateRoom;
