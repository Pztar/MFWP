import styled from "styled-components";
import palette from "../../lib/styles/palette";
import client from "../../lib/api/client";
import { useRef } from "react";
import { useDispatch } from "react-redux";

const RegistProductBlock = styled.div`
  div {
    margin-top: 1rem;
    width: 100%;
    border-bottom: 1px solid ${palette.gray[5]};
  }

  input {
    font-size: 1rem;
    display: block;
    padding-top: 3px;
    padding-bottom: 0.5rem;
  }

  img {
    max-width: 50%;
    max-height: 50px;
  }
`;

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  padding-top: 3px;
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
`;

const RegistProduct = ({
  onChange,
  changeField,
  name,
  category,
  img,
  explanation,
  price,
  terminatedAt,
}) => {
  const dispatch = useDispatch();
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
      dispatch(
        changeField({
          key: "img",
          value: IMG_URL,
        })
      );
    } catch (error) {
      console.log("실패", error);
    }
  };

  return (
    <RegistProductBlock>
      <div className="input-group">
        <label>상품명</label>
        <StyledInput
          placeholder="상품명"
          type="text"
          name="name"
          onChange={onChange}
          value={name}
          required
          autoFocus
        />
      </div>
      <div className="input-group">
        <label>카테고리</label>
        <StyledInput
          placeholder="상품 분류"
          type="text"
          name="category"
          onChange={onChange}
          value={category}
          required
          autoFocus
        />
      </div>
      <div className="input-group">
        <label>상품 사진</label>
        <img alt="inputImg" src={img} align="right" />
        <input
          type="file"
          accept="image/*"
          onChange={onChangeFile}
          ref={inputImg}
          required
        />
      </div>
      <div className="input-group">
        <label>설명(링크)</label>
        <StyledInput
          placeholder="상품 설명글의 url(웹주소)"
          type="text"
          name="explanation"
          onChange={onChange}
          value={explanation}
          required
          autoFocus
        />
      </div>
      <div className="input-group">
        <label>경매 시작 가격</label>
        <StyledInput
          type="number"
          name="price"
          onChange={onChange}
          value={price}
          required
        />
      </div>
      <div className="input-group">
        <label>경매 종료</label>
        <StyledInput
          type="datetime-local"
          name="terminatedAt"
          onChange={onChange}
          value={terminatedAt}
          required
        />
      </div>
    </RegistProductBlock>
  );
};

export default RegistProduct;
