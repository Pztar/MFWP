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

const buildLink = ({ userId, query, page }) => {
  const makeQuery = qs.stringify({ ...query, page });
  return userId ? `/posts/${userId}?${makeQuery}` : `/posts/?${makeQuery}`;
};

const Pagination = ({ page, lastPage, userId, query }) => {
  return (
    <>
      <PaginationBlock>
        <Button
          disabled={page === 1}
          to={
            page === 1
              ? undefined
              : buildLink({
                  userId,
                  query,
                  page: page - 1,
                })
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
              : buildLink({
                  userId,
                  query,
                  page: page + 1,
                })
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
