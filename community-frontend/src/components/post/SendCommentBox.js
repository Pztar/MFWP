import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import React, { useRef, useState, useEffect } from "react";
import "quill/dist/quill.snow.css";
import Button from "../common/Button";
import quillModulesOption from "../write/quillModulesOption";
import client from "../../lib/api/client";
import Quill from "quill";

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
`;

const QuillWrapper = styled.div`
  height: 12.1rem;
  margin: 0;
  .ql-toolbar {
    padding: 0.2rem;
  }
  .ql-container {
    height: 10rem;
  }
  .ql-editor {
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
    line-height: 1.5;
  }
  .ql-editor.ql-blank::before {
    left: 0.3rem;
  }
  iframe {
    width: 90%;
    aspect-ratio: auto 16 / 9;
    background: gray;
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
  onChangeField,
  ordinalNumber,
  onPublish,
}) => {
  const [showCommentEditor, setShowCommentEditor] = useState(false);
  const quillElement = useRef(null);
  const quillInstence = useRef(null);

  useEffect(() => {
    quillInstence.current = new Quill(quillElement.current, {
      theme: "snow",
      placeholder: "내용을 작성하세요...",
      modules: {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike"], // toggled buttons
            ["link", "image", "video"],

            //[{ header: 1 }, { header: 2 }], // custom button values
            [{ list: "ordered" }, { list: "bullet" }],
            [{ script: "sub" }, { script: "super" }], // superscript/subscript
            //[{ indent: "-1" }, { indent: "+1" }], // outdent/indent
            //[{ direction: "rtl" }], // text direction

            //[{ size: ["small", false, "large", "huge"] }], // custom dropdown

            [{ color: [] }, { background: [] }], // dropdown with defaults from theme
            [{ font: [] }],
            [{ align: [] }],

            ["clean"], // remove formatting button
          ],
          handlers: {
            // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
            image: () => {
              // 1. 이미지를 저장할 input type=file DOM을 만든다.
              const input = document.createElement("input");
              // 속성 써주기
              input.setAttribute("type", "file");
              input.setAttribute("accept", "image/*");
              input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
              // input이 클릭되면 파일 선택창이 나타난다.

              // input에 변화가 생긴다면 = 이미지를 선택
              input.addEventListener("change", async () => {
                const file = input.files[0];
                // multer에 맞는 형식으로 데이터 만들어준다.
                const formData = new FormData();
                formData.append("file", file); // formData는 키-밸류 구조
                // 백엔드 multer라우터에 이미지를 보낸다.
                try {
                  const result = await client.post(
                    "http://localhost:4000/api/file",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  const IMG_URL = result.data.url;
                  const editor = quillInstence.current; // 에디터 객체 가져오기
                  const range = editor.getSelection();
                  editor.insertEmbed(range.index, "image", IMG_URL);
                  onChangeField({
                    key: "content",
                    value: quill.root.innerHTML,
                  });
                } catch (error) {
                  console.log("실패", error);
                }
              });
            },
          },
        },
        ImageResize: {
          parchment: Quill.import("parchment"),
        },
      },
    });

    const quill = quillInstence.current;
    quill.on("text-change", (delta, oldDelta, source) => {
      if (source === "user") {
        onChangeField({ key: "content", value: quill.root.innerHTML });
      }
    });
  }, [onChangeField]);

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
            <QuillWrapper>
              <div ref={quillElement} />
            </QuillWrapper>
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
