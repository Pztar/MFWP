import styled from "styled-components";
import Button from "../common/Button";
import qs from "qs";
import { useState } from "react";

const Spacer = styled.div`
  height: 1rem;
`;

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto 0;
  display: flex;
  justify-content: space-between;
`;

const buildLink = ({ userId, title, content, userNick, hashtag, page }) => {
  const query = qs.stringify({ title, content, userNick, hashtag, page });
  return userId ? `/posts/${userId}?${query}` : `/posts/?${query}`;
};

const SearchOption = ({ userId }) => {
  const [selected, setSelected] = useState("title");
  const [searchWord, setSearchWord] = useState("");
  return (
    <>
      <PaginationBlock>
        <select onChange={(e) => setSelected(e.target.value)} value={selected}>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="userNick">작성자</option>
          <option value="hashtag">해쉬태그</option>
        </select>
        <input
          onChange={(e) => setSearchWord(e.target.value)}
          value={searchWord}
        />
        <Button to={buildLink({ userId, [selected]: searchWord, page: 1 })}>
          검색
        </Button>
      </PaginationBlock>
      <Spacer />
    </>
  );
};

export default SearchOption;
