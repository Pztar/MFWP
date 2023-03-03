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
  width: 440px;
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

  .reportContent {
    width: 100%;
    height: 5rem;
    margin-top: 0.3rem;
    white-space: normal;
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
        setCategory(e.target.value);
      }}
    >
      <RadioGroup label="신고 분류">
        <Radio className="radio" name="category" value="advertisement">
          광고
        </Radio>
        <Radio name="category" value="pornography">
          음란물
        </Radio>
        <Radio name="category" value="slander">
          비방 및 욕설
        </Radio>
        <Radio name="category" value="fakeNews">
          허위사실유포
        </Radio>
        <Radio name="category" value="Etc">
          기타
        </Radio>
      </RadioGroup>
    </form>
  );
}

const Report = ({
  reportVisible,
  setReportVisible,
  reportedClass,
  reportedClassId,
  confirmText = "확인",
  cancleText = "취소",
}) => {
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  if (!reportVisible) return null;
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
        <h2>{reportedClass} 신고</h2>
        <SelectRadios setCategory={setCategory} />
        <textarea
          className="reportContent"
          type="text"
          onChange={(e) => {
            setContent(e.target.value);
          }}
          value={content}
        />
        <div>{content.length}/200</div>
        <div className="buttons">
          <StyledButton
            onClick={(e) => {
              setReportVisible(false);
              setCategory("");
              setContent("");
            }}
          >
            {cancleText}
          </StyledButton>
          <StyledButton
            cyan
            onClick={(e) => {
              if (category && content && content.length <= 200) {
                client.post(submitUrl, {
                  category: category,
                  content: content,
                });
                setCategory("");
                setContent("");
                setReportVisible(false);
                alert("신고되었습니다");
              } else if (content.length > 200) {
                alert("200자 이내로 입력 바랍니다");
              } else {
                alert("신고 내용을 입력하여 주시기 바랍니다");
              }
            }}
          >
            {confirmText}
          </StyledButton>
        </div>
      </AskModalBlock>
    </Fullscreen>
  );
};

export default Report;
