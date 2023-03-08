import styled from "styled-components";
import Button from "../common/Button";
import qs from "qs";
import { useState } from "react";

const Spacer = styled.div`
  height: 1rem;
`;

const SearchOptionBlock = styled.div`
  width: auto;
  margin: 0 auto 0;
  display: flex;
  justify-content: center;
`;

const buildLink = ({
  userId,
  hashtag,
  page,
  order,
  dateRange,
  selected,
  searchWord,
}) => {
  const query = qs.stringify({
    hashtag,
    page,
    order,
    dateRange,
    selected,
    searchWord,
  });
  return userId ? `/posts/${userId}?${query}` : `/posts/?${query}`;
};

const SearchOption = ({ userId, hashtag }) => {
  const [order, setOrder] = useState("createdAt");
  const [dateRange, setDateRange] = useState("all");
  const [selected, setSelected] = useState("title+content");
  const [searchWord, setSearchWord] = useState("");
  return (
    <>
      <SearchOptionBlock>
        <select onChange={(e) => setOrder(e.target.value)} value={order}>
          <option value="createdAt">기본</option>
          <option value="views">조회수</option>
          <option value="likes">좋아요</option>
          <option value="hates">싫어요</option>
        </select>
        <select
          onChange={(e) => setDateRange(e.target.value)}
          value={dateRange}
        >
          <option value="all">전체</option>
          <option value="1day">1일</option>
          <option value="3days">3일</option>
          <option value="1week">1주</option>
          <option value="1month">1달</option>
        </select>
        <select onChange={(e) => setSelected(e.target.value)} value={selected}>
          <option value="title+content">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="userNick">작성자</option>
        </select>
        <input
          onChange={(e) => setSearchWord(e.target.value)}
          value={searchWord}
        />
        <Button
          to={buildLink({
            userId,
            hashtag,
            selected,
            searchWord,
            page: 1,
            order,
            dateRange,
          })}
        >
          검색
        </Button>
      </SearchOptionBlock>
      <Spacer />
    </>
  );
};

export default SearchOption;
