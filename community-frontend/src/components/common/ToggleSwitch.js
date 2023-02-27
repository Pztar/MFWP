import React from "react";
import styled from "styled-components";
import palette from "../../lib/styles/palette";

// checkbox wrapper
const Wrapper = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  z-index: 0;
`;
const CheckBoxLabel = styled.label`
  z-index: 1;
  width: 4.5rem; //알약 크기 조절
  height: 1.7rem; //알약 크기 조절
  background: #588dff;
  background: ${(props) => props.leftBgColor ?? palette.gray[6]};
  border-radius: 1rem;
  &:hover {
    cursor: pointer;
  }
  /* 선택X 텍스트 */
  ::before {
    position: absolute;
    content: "${(props) => props.left ?? "Yes"}";
    padding-left: 0.4em; //왼쪽 글씨 위치 조절
    width: 3.5rem; //오른쪽 글씨 위치 조절
    height: 1.7rem; //글씨 높이 조절
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: ${(props) => props.leftColor ?? palette.gray[0]};
    font-weight: bold;
    font-size: 1rem;
    /* 텍스트 트랜지션 */
    transition: all 0.2s ease-in-out;
  }
  /* 선택X 원 */
  ::after {
    position: relative;
    content: "";
    display: block;
    width: 1.3em;
    height: 1.3em;
    top: calc((1.7rem - 1.3em) / 2);
    left: calc(4.5rem - 1.55em);
    border-radius: 50%;
    background: ${(props) => props.circleColor ?? palette.gray[0]};
    /* 원 이동 트랜지션 */
    transition: all 0.2s ease-in-out;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  width: 1px;
  height: 1px;

  &:checked + ${CheckBoxLabel} {
    background-color: ${(props) => props.rightBgColor ?? palette.gray[9]};
    /* 배경색 변경 트랜지션 */
    transition: all 0.2s ease-in-out;
    /* 선택 O 텍스트 */
    ::before {
      position: absolute;
      padding-right: 0.65em;
      content: "${(props) => props.right ?? "No"}";
      align-items: center;
      justify-content: flex-end;
      color: ${(props) => props.rightColor ?? palette.gray[0]};
    }
    /* 선택 O 원 */
    ::after {
      content: "";
      z-index: 2;
      top: calc((1.7rem - 1.3em) / 2);
      left: calc((2rem - 1.45em) / 2);
      width: 1.3em;
      height: 1.3em;
      display: block;
      border-radius: 50%;
      background: ${(props) => props.circleColor ?? palette.gray[0]};
      position: relative;
    }
  }
`;
const ToggleSwitch = ({
  left,
  right,
  leftColor,
  rightColor,
  leftBgColor,
  rightBgColor,
  circleColor,
  setChecked,
}) => {
  return (
    <Wrapper>
      <CheckBox
        type="checkbox"
        id="toggle"
        right={right}
        rightColor={rightColor}
        rightBgColor={rightBgColor}
        circleColor={circleColor}
        onChange={() => setChecked()}
      />
      <CheckBoxLabel
        left={left}
        leftColor={leftColor}
        leftBgColor={leftBgColor}
        circleColor={circleColor}
        htmlFor="toggle"
      />
    </Wrapper>
  );
};

export default ToggleSwitch;
