import styled from "styled-components";
import Responsive from "../common/Responsive";
import client from "../../lib/api/client";
import { useRef } from "react";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";

const FooterBlock = styled.div`
  position: fixed;
  //background-color: black;
  bottom: 0px;
  width: 100%;
`;

const Wrapper = styled(Responsive)`
  padding: 0;
`;
const InputImgLabel = styled.label`
  border: solid black 1px;
  border-radius: 0.5rem;
  margin: 0.5rem;
  padding: 0.2rem;
  &:hover {
    cursor: pointer;
  }
`;
const InputImgBlock = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  &.hasImg {
    padding: 1rem;
    border-radius: 1rem;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .cancleImg {
    font-size: 1.5rem;
    height: 2rem;
    width: 2rem;
    border-radius: 1rem;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.25);

    &:hover {
      cursor: pointer;
    }
  }
  img {
    max-height: 450px;

    @media (max-height: 1440px) {
      max-height: 350px;
    }
    @media (max-height: 1080px) {
      max-height: 250px;
    }
    @media (max-height: 768px) {
      max-height: 180px;
    }
    max-width: 60%;
  }
`;

const InputBoxBlock = styled.div`
  width: 100%;
  background: white;
  padding: 3px;
  padding-top: 0.6rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);

  input {
    display: block;
  }

  .inputImg {
    padding-bottom: 0.5rem;
    opacity: 0.5;
    position: absolute;
    bottom: -100rem;
  }

  .inputChatTxt {
    font-size: 1rem;
    outline: none;
    padding-bottom: 0.5rem;
    border: none;
    border-bottom: 1px solid ${palette.gray[4]};
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    width: 100%;
  }
`;

const InputChatBlock = styled.div`
  display: flex;
  justify-content: space-between;
  justify-items: stretch;
  margin-top: 0.7rem;

  .sendButton {
    white-space: nowrap;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-left: 0.8rem;
  }
`;

const SendChatBox = ({
  imgUrl,
  setImgUrl,
  chatTxt,
  onChangeChatTxt,
  onSend,
}) => {
  const inputImg = useRef(null);

  const onChangeFile = async () => {
    const input = inputImg.current;
    const file = input.files[0];
    // multer에 맞는 형식으로 데이터 만들어준다.
    const formData = new FormData();
    formData.append("file", file); // formData는 키-밸류 구조
    // 백엔드 multer라우터에 이미지를 보낸다.
    try {
      const result = await client.post("/api/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const IMG_URL = result.data.url;
      setImgUrl(IMG_URL);
      inputImg.current.value = "";
    } catch (error) {
      console.log("실패", error);
    }
  };

  return (
    <FooterBlock>
      <Wrapper>
        <InputImgBlock className={imgUrl ? "hasImg" : null}>
          {imgUrl && (
            <>
              <div
                className="cancleImg"
                onClick={(e) => {
                  setImgUrl("");
                }}
              >
                X
              </div>{" "}
              <img alt="inputImg" src={imgUrl} />
            </>
          )}
        </InputImgBlock>
        <InputBoxBlock>
          <InputImgLabel htmlFor="img">사진 선택</InputImgLabel>
          <input
            type="file"
            onChange={onChangeFile}
            accept="image/*"
            ref={inputImg}
            className="inputImg"
            id="img"
          />
          <InputChatBlock>
            <input
              type="text"
              onChange={onChangeChatTxt}
              value={chatTxt}
              className="inputChatTxt"
              placeholder="전송할 내용을 입력하세요"
            />
            <Button onClick={onSend} className="sendButton">
              send
            </Button>
          </InputChatBlock>
        </InputBoxBlock>
      </Wrapper>
    </FooterBlock>
  );
};

export default SendChatBox;
