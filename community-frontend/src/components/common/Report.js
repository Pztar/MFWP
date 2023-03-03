import { useState } from "react";
import styled from "styled-components";
import client from "../../lib/api/client";
import Button from "./Button";

const Fullscreen = styled.div`
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AskModalBlock = styled.div`
  width: 320px;
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  box-shadow: 0px, 0px, 8px, rgba(0, 0, 0, 0.125);
  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  p {
    margin-bottom: 3rem;
  }
  .buttons {
    display: flex;
    justify-content: flex-end;
  }
`;

const StyledButton = styled(Button)`
  height: 2rem;
  & + & {
    margin-left: 0.75rem;
  }
`;
function Radio({ children, value, name, defaultChecked, disabled }) {
  return (
    <label>
      <input
        type="radio"
        value={value}
        name={name}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      {children}
    </label>
  );
}
function RadioGroup({ label, children }) {
  return (
    <fieldset>
      <legend>{label}</legend>
      {children}
    </fieldset>
  );
}
function SelectRadios({ setCategory }) {
  return (
    <form
      onChange={(e) => {
        setCategory(e.target.category.value);
      }}
    >
      <RadioGroup>
        <Radio name="category" value="advertisement" defaultChecked>
          광고
        </Radio>
        <Radio name="category" value="pornography">
          음란물
        </Radio>
        <Radio name="category" value="slander">
          비방 및 욕설
        </Radio>
        <Radio name="category" value="fakeNews" disabled>
          허위사실유포
        </Radio>
        <Radio name="category" value="Etc" disabled>
          기타
        </Radio>
      </RadioGroup>
    </form>
  );
}

const Report = ({
  visible,
  reportedClass,
  reportedClassId,
  confirmText = "확인",
  cancleText = "취소",
  onCancle,
}) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  if (!visible) return null;
  let submitUrl = "";
  switch (reportedClass) {
    case "post":
      const postId = reportedClassId;
      submitUrl = `/api/posts/${postId}/report`;
      break;
    case "comment":
      const commentId = reportedClassId;
      submitUrl = `/api/posts/comment/${commentId}/report`;
      break;
    case "product":
      const productId = reportedClassId;
      submitUrl = `/api/auction/product/${productId}/report`;
      break;
    default:
  }
  return (
    <Fullscreen>
      <AskModalBlock>
        <h2>{reportedClass}</h2>
        <SelectRadios setCategory={setCategory} />
        <input
          type="text"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        />
        <div className="buttons">
          <StyledButton onClick={onCancle}>{cancleText}</StyledButton>
          <StyledButton
            cyan
            onClick={(e) => {
              client.post(submitUrl, { category: category, content: content });
              setCategory("");
              setContent("");
              onCancle();
              alert("신고되었습니다");
            }}
          >
            {confirmText}
          </StyledButton>
        </div>
        <div>
          {category}/{content}
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

export default Report;
