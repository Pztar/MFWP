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

const AlretBlock = styled.div`
  display: flex;
  justify-content: end;
  padding: 1rem;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  font-weight: bold;
  font-size: large;
  color: #e30000;
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

const SendBidBox = ({ bid, msg, onChangeField, onSend, alret }) => {
  return (
    <FooterBlock>
      <Wrapper>
        {alret && <AlretBlock>{alret}</AlretBlock>}
        <InputBoxBlock>
          <InputChatBlock>
            <input
              type="number"
              onChange={onChangeField}
              name="bid"
              value={bid}
              className="inputChatTxt"
              placeholder="입찰가"
            />
            <input
              type="text"
              onChange={onChangeField}
              name="msg"
              value={msg}
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
