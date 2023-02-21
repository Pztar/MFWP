import styled from "styled-components";
import Button from "../common/Button";
import qs from "qs";

const Spacer = styled.div`
  height: 1rem;
`;

const PaginationBlock = styled.div`
  width: 320px;
  margin: 0 auto 0;
  display: flex;
  justify-content: space-between;
`;

const PageNumber = styled.div``;

const buildLink = ({ userId, hashtag, page }) => {
  const query = qs.stringify({ hashtag, page });
  return userId ? `/${userId}?${query}` : `/?${query}`;
};

const Pagination = ({ page, lastPage, userId, hashtag }) => {
  return (
    <>
      <PaginationBlock>
        <Button
          disabled={page === 1}
          to={
            page === 1
              ? undefined
              : buildLink({ userId, hashtag, page: page - 1 })
          }
        >
          이전
        </Button>
        <PageNumber>{page}</PageNumber>
        <Button
          disabled={page === lastPage}
          to={
            page === lastPage
              ? undefined
              : buildLink({ userId, hashtag, page: page + 1 })
          }
        >
          다음
        </Button>
      </PaginationBlock>
      <Spacer />
    </>
  );
};

export default Pagination;
