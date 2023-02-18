import styled from "styled-components";
import Responsive from "../common/Responsive";
import client from "../../lib/api/client";
import { useRef, useState } from "react";
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

const InputImgBlock = styled.div`
  display: flex;
  justify-content: end;
  padding: 1rem;
  width: 100%;

  img {
    height: 450px;

    @media (max-height: 1440px) {
      height: 350px;
    }
    @media (max-height: 1080px) {
      height: 250px;
    }
    @media (max-height: 768px) {
      height: 180px;
    }
    max-width: 60%;
  }
`;

const InputBoxBlock = styled.div`
  width: 100%;
  background: white;
  padding: 3px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.8);

  input {
    display: block;
  }

  .inputImg {
    padding-bottom: 0.5rem;
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

  .sendButton {
    white-space: nowrap;
    padding-top: 0px;
    padding-bottom: 0px;
    margin-left: 0.8rem;
  }
`;

const SendBidBox = ({ bidTxt, chatTxt, onChangeChatTxt, onSend }) => {
  return (
    <FooterBlock>
      <Wrapper>
        <InputBoxBlock>
          <InputChatBlock>
            <input
              type="number"
              onChange={onChangeChatTxt}
              value={bidTxt}
              className="inputChatTxt"
              placeholder="입찰가"
            />
            <input
              type="text"
              onChange={onChangeChatTxt}
              value={chatTxt}
              className="inputChatTxt"
              placeholder="메세지"
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

export default SendBidBox;
