import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../common/Button";

const CommentViewerBlock = styled.div`
  width: 100%;
`;

const Spacer = styled.div`
  height: 20rem;
`;

const FooterBlock = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0px;
`;

const Wrapper = styled(Responsive)`
  padding: 0;
  width: 100%;
`;

const SetRightBlock = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const WriteCommentButton = styled(Button)`
  margin: 1rem;
  padding: 0.4rem;
  height: 3.3rem;
  width: 3.3rem;
  border-radius: 3rem;
  font-size: 0.9rem;
`;

const InputBlock = styled.div`
  padding: 0.1rem 0.3rem;
  box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.8);
  background-color: white;
  width: 100%;
  height: 14.5rem;
  .ql-toolbar {
    padding: 0.2rem;
  }
  .ql-editor {
    padding: 0.1rem 0.3rem;
    height: 10rem;
    font-size: 1rem;
    line-height: 1.5;
  }
  .ql-editor.ql-blank::before {
    left: 0.3rem;
  }
`;

const SendCommentBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem;
  width: 100%;
`;

const SendCommentButton = styled(Button)`
  font-size: 0.9rem;
`;

const SendCommentBox = () => {
  const [value, setValue] = useState("");
  return (
    <CommentViewerBlock>
      <Spacer />
      <FooterBlock>
        <Wrapper>
          <SetRightBlock>
            <WriteCommentButton cyan="true">댓글 쓰기</WriteCommentButton>
          </SetRightBlock>
          <InputBlock>
            <ReactQuill
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder="댓글 내용"
            />
            <SendCommentBlock>
              <input placeholder="본문 번호" />
              <SendCommentButton>댓글 등록</SendCommentButton>
            </SendCommentBlock>
          </InputBlock>
        </Wrapper>
      </FooterBlock>
    </CommentViewerBlock>
  );
};

export default SendCommentBox;
