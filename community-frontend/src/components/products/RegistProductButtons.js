import styled from "styled-components";
import Button from "../common/Button";

const RegistProductButtonsBlock = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
  button + button {
    margin-left: 0.5rem;
  }
`;

const StyledButton = styled(Button)`
  height: 2.125rem;
  & + & {
    margin-left: 0.5rem;
  }
`;

const RegistProductButtons = ({ onCancle, onPublish, isEdit }) => {
  return (
    <RegistProductButtonsBlock>
      <StyledButton cyan onClick={onPublish}>
        상품 {isEdit ? "수정" : "등록"}
      </StyledButton>
      <StyledButton onClick={onCancle}>취소</StyledButton>
    </RegistProductButtonsBlock>
  );
};

export default RegistProductButtons;
