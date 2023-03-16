import styled from "styled-components";
import Responsive from "../common/Responsive";
import Tags from "../common/Tags";
import Pagination from "./Pagination";
const HashtagListBlock = styled(Responsive)`
  margin: 1rem 0.3rem;
`;
const HashtagList = ({ hashtags, page, lastPage }) => {
  const Hashtags = hashtags;
  return (
    <HashtagListBlock>
      <Tags Hashtags={Hashtags} tagedPostCount={true} />
      {/* <Pagination page={page} lastPage={lastPage} /> */}
    </HashtagListBlock>
  );
};

export default HashtagList;
