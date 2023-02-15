import styled from "styled-components";
import Responsive from "../common/Responsive";
import client from "../../lib/api/client";
import { useRef } from "react";

const SendChatButtonBlock = styled(Responsive)`
  margin-top: 3rem;

  table {
    width: 100%;
  }

  th {
    border: solid 1px black;
    padding: 3px 1px 3px 1px;
  }
`;

const SendChatButton = ({ imgUrl, chatTxt, setImgUrl, onChangeChatTxt }) => {
  const inputImg = useRef(null);
  const input = inputImg.current;
  const onChangeFile = async () => {
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
      setImgUrl(IMG_URL);
    } catch (error) {
      console.log("실패", error);
    }
  };
  return (
    <SendChatButtonBlock>
      <input
        type="file"
        onChange={onChangeFile}
        accept="image/*"
        ref={inputImg}
      />
      <input
        type="text"
        onChange={onChangeChatTxt}
        name="chatTxt"
        value={chatTxt}
      />
      <div>
        imUrl={imgUrl}/
        <img alt="inputImg" src={imgUrl} align="right" />
        chatTxt={chatTxt}
      </div>
    </SendChatButtonBlock>
  );
};

export default SendChatButton;
