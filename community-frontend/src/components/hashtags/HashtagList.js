import styled from "styled-components";
import Responsive from "../common/Responsive";
import Tags from "../common/Tags";
const HashtagListBlock = styled(Responsive)`
  margin: 1rem 0.3rem;
`;
const HashtagList = ({ hashtags }) => {
  const Hashtags = hashtags;
  return (
    <HashtagListBlock>
      <Tags Hashtags={Hashtags} tagedPostCount={true} />
    </HashtagListBlock>
  );
};

export default HashtagList;
