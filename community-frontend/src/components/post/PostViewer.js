import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";
import { Helmet } from "react-helmet-async";

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const PostContent = styled.div`
  font-size: 1.3125rem;
  color: ${palette.gray[8]};
  img {
    max-width: 100%;
    min-width: 3%;
    height: auto;
    min-height: 3%;
  }
  iframe {
    width: 100%;
    aspect-ratio: 16 / 9 auto;
    background: gray;
  }
`;

const PostViewer = ({ post, error, loading, actionButtons }) => {
  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    }
    return <PostViewerBlock>오류발생!</PostViewerBlock>;
  }

  if (loading) {
    return <div>로딩 중</div>;
  }

  if (!post) {
    return <div>포스트 데이터가 없습니다</div>;
  }

  const {
    id,
    title,
    content,
    likes,
    unlikes,
    createdAt,
    updatedAt,
    User,
    Hashtags,
  } = post;
  const postId = id;
  const likeCount = likes - unlikes;

  return (
    <PostViewerBlock>
      <Helmet>
        <title>{title} - REACTERS</title>
      </Helmet>
      <PostHead>
        <h1>{title}</h1>
        <SubInfo
          user={User}
          createdTime={new Date(createdAt)}
          updatedTime={new Date(updatedAt)}
          likeCount={likeCount}
          hasMarginTop
        />
        <Tags Hashtags={Hashtags} />
      </PostHead>
      {actionButtons}
      <PostContent dangerouslySetInnerHTML={{ __html: content }} />
    </PostViewerBlock>
  );
};

export default PostViewer;
