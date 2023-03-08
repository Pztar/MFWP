import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";
//import Tags from "../common/Tags";

const PostLitstBlock = styled(Responsive)`
  margin-top: 3rem;
`;

const WritePostButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
  margin-bottom: 5px;
`;
const TitleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0;
  h2 {
    display: inline;
    font-size: 1.3rem;
    margin-bottom: 0;
    margin-top: 0;
    padding: 0;
    &:hover {
      color: ${palette[6]};
    }
  }
  span {
    font-size: 1rem;
    text-align: center;
    margin: auto 0;
    color: ${palette.gray[8]};
  }
`;
const PostItemBlock = styled.div`
  margin: 0.1rem auto 0.1rem;
  padding: 0.1rem 0.5rem;
  &:first-child {
    padding-top: 0;
  }

  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }
`;

const PostItem = ({ post }) => {
  const {
    id,
    title,
    content,
    views,
    likes,
    hates,
    reports,
    commentCounts,
    createdAt,
    updatedAt,
    UserId,
    User,
    Hashtags,
  } = post;
  const postId = id;
  const userId = UserId;
  const likeCount = likes - hates;
  return (
    <PostItemBlock>
      <SubInfo
        user={User}
        createdTime={new Date(createdAt)}
        updatedTime={new Date(updatedAt)}
        views={views}
        likeCount={likeCount}
        reports={reports}
      />
      <TitleBlock>
        <h2>
          <Link to={`/posts/${userId}/${postId}`}>{title}</Link>
        </h2>
        {commentCounts > 0 ? <span>{`댓글: [${commentCounts}]`}</span> : null}
      </TitleBlock>
      {Hashtags && <Tags Hashtags={Hashtags} />}
      {/*<p>{content}</p> */}
    </PostItemBlock>
  );
};

const PostList = ({ posts, loading, error, showWriteButton }) => {
  if (error) {
    return <PostLitstBlock>에러가 발생했습니다.</PostLitstBlock>;
  }

  return (
    <PostLitstBlock>
      <WritePostButtonWrapper>
        {showWriteButton && (
          <Button cyan to="/posts/write">
            새 글 작성하기
          </Button>
        )}
      </WritePostButtonWrapper>
      {!loading && posts && (
        <div>
          {posts.map((post) => (
            <PostItem post={post} key={post.id} />
          ))}
        </div>
      )}
    </PostLitstBlock>
  );
};

export default PostList;
