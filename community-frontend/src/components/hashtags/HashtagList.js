import styled from "styled-components";
import Responsive from "../common/Responsive";
import Tags from "../common/Tags";
import Pagination from "./Pagination";
const HashtagListBlock = styled(Responsive)`
  margin: 1rem 0.3rem;
`;
const HashtagList = ({ hashtags, page, lastPage }) => {
  const Hashtags = hashtags;
  if (!hashtags) {
    return <HashtagListBlock>에러 발생</HashtagListBlock>;
  } else if (hashtags.length === 0) {
    return <HashtagListBlock>검색된 해시태그가 없습니다</HashtagListBlock>;
  }
  return (
    <HashtagListBlock>
      <Tags Hashtags={Hashtags} tagedPostCount={true} />
      {/* <Pagination page={page} lastPage={lastPage} /> */}
    </HashtagListBlock>
  );
};

export default HashtagList;
