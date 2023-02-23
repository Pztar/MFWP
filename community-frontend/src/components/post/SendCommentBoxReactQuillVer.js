import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "../common/Button";
import quillModulesOption from "../write/quillModulesOption";
import ImageResize from "quill-image-resize";
import Quill from "quill";
Quill.register("modules/ImageResize", ImageResize);

const CommentViewerBlock = styled.div`
  width: 100%;
  .hide {
    height: 0;
    //display: none 으로 설정시 언마운트 되어 transition 효과가 적용되지 않음
    //이 경우 React Transition Group 모듈 설치 필요
  }
`;

const Spacer = styled.div`
  height: 20rem;
  transition: all 0.2s ease-in-out;
`;

const FooterBlock = styled.div`
  position: fixed;
  width: 100%;
  bottom: 0px;
`;

const Wrapper = styled(Responsive)`
  padding: 0;
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
  transition: all 0.2s ease-in-out;
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

const SendCommentBox = ({
  onChange,
  onChangeContent,
  onChangeField,
  content,
  ordinalNumber,
  onPublish,
}) => {
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const quillInstence = useRef(null);
  const modules = quillModulesOption(quillInstence, onChangeField);
  return (
    <CommentViewerBlock>
      <Spacer />
      <FooterBlock>
        <Wrapper>
          <SetRightBlock>
            <WriteCommentButton
              cyan="true"
              onClick={(e) => {
                setShowCommentEditor(!showCommentEditor);
              }}
            >
              댓글 쓰기
            </WriteCommentButton>
          </SetRightBlock>
          <InputBlock className={showCommentEditor ? "show" : "hide"}>
            <ReactQuill
              ref={quillInstence}
              theme="snow"
              onChange={onChangeContent}
              placeholder="댓글 내용"
              name="content"
              value={content}
              modules={modules}
            />
            <SendCommentBlock>
              <input
                type="number"
                min="-1"
                placeholder="본문 문단 번호"
                name="ordinalNumber"
                value={ordinalNumber}
                onChange={onChange}
              />
              <SendCommentButton onClick={onPublish}>
                댓글 등록
              </SendCommentButton>
            </SendCommentBlock>
          </InputBlock>
        </Wrapper>
      </FooterBlock>
    </CommentViewerBlock>
  );
};

export default SendCommentBox;
