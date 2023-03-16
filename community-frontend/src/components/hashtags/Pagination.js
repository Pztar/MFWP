import styled from "styled-components";
import Button from "../common/Button";
import qs from "qs";

const Spacer = styled.div`
  height: 1rem;
`;

const PaginationBlock = styled.div`
  width: 320px;
  margin: 1rem auto 0;
  display: flex;
  justify-content: space-between;
`;

const PageNumber = styled.div``;

const buildLink = ({ query, page }) => {
  const makeQuery = qs.stringify({ ...query, page });
  return `/hashtags?${makeQuery}`;
};

const Pagination = ({ page = 1, lastPage, query }) => {
  const Page = parseInt(page, 10);
  console.log(Page, lastPage);
  return (
    <>
      <PaginationBlock>
        <Button
          disabled={Page === 1}
          to={
            page === 1
              ? undefined
              : buildLink({
                  query,
                  page: page - 1,
                })
          }
        >
          이전
        </Button>
        <PageNumber>{page}</PageNumber>
        <Button
          disabled={Page === lastPage}
          to={
            page === lastPage
              ? undefined
              : buildLink({
                  query,
                  page: Page + 1,
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
