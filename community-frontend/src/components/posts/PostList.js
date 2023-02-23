import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
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

const PostItemBlock = styled.div`
  margin: 0.3rem auto 0.3rem;
  padding: 0.5rem;
  &:first-child {
    padding-top: 0;
  }

  & + & {
    border-top: 1px solid ${palette.gray[2]};
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 0;
    margin-top: 0;
    &:hover {
      color: ${palette[6]};
    }
  }

  p {
    margin-top: 2rem;
  }
`;

const PostItem = ({ post }) => {
  const {
    id,
    title,
    content,
    likes,
    unlikes,
    createdAt,
    updatedAt,
    UserId,
    User,
  } = post;
  const postId = id;
  const userId = UserId;
  const likeCount = likes - unlikes;
  return (
    <PostItemBlock>
      <SubInfo
        user={User}
        createdTime={new Date(createdAt)}
        updatedTime={new Date(updatedAt)}
        likeCount={likeCount}
      />
      <h2>
        <Link to={`/posts/${userId}/${postId}`}>{title}</Link>
      </h2>
      {/*<Tags tags={tags} /> */}
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
