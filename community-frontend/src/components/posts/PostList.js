import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";
import { useState } from "react";
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

const PromptBlock = styled.div`
  background: none; //${palette.gray[3]};
  padding-left: 5px;
  width: auto;
  height: auto;
  position: relative;
  display: flex;
  //top: 10%;
  //left: 50%;
  //transform: translateX(-50%);
  border-radius: 5px;
  input {
    font-size: 1rem;
    padding: 0.1rem 0.5rem;
    margin: 3px;
    font-size: 0.9rem;
  }
  a,
  Button {
    margin: 3px;
    font-size: 0.9rem;
  }
`;

const Prompt = ({ onClosePrompt, userId, LinkedPostId }) => {
  const [inputPassword, setInputPassword] = useState("");
  const onChangePassword = (e) => {
    setInputPassword(e.target.value);
  };

  return (
    <PromptBlock>
      <span>┗ </span>
      <input
        placeholder="비밀번호를 입력하세요"
        onChange={onChangePassword}
        value={inputPassword}
      />
      <Button to={`/posts/${userId}/${LinkedPostId}?password=${inputPassword}`}>
        확인
      </Button>
      <Button
        onClick={(e) => {
          onClosePrompt(e, setInputPassword);
        }}
      >
        취소
      </Button>
    </PromptBlock>
  );
};

const TitleBlock = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0;
  white-space: nowrap;
  h2 {
    overflow: hidden;
    text-overflow: ellipsis;
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
    password,
    levelLimit,
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

  const [showPrompt, setShowPrompt] = useState(false);
  const [LinkedPostId, setLinkedPostId] = useState("");
  const onOpenPrompt = (e, postId) => {
    setShowPrompt(true);
    setLinkedPostId(postId);
  };
  const onClosePrompt = (e, setInputPassword) => {
    setShowPrompt(false);
    setLinkedPostId("");
    setInputPassword("");
  };
  return (
    <>
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
            {levelLimit > 0 ? `lv${levelLimit}` : null}
            {password ? (
              <>
                🔒
                <Link
                  onClick={(e) => {
                    onOpenPrompt(e, postId); //이벤트 핸들러에 event 객체 외의 파라미터를 넘겨주는 방법
                  }}
                >
                  {title}
                </Link>
              </>
            ) : (
              <Link to={`/posts/${userId}/${postId}`}>{title}</Link>
            )}
          </h2>
          {commentCounts > 0 ? <span>{`댓글: [${commentCounts}]`}</span> : null}
        </TitleBlock>
        {showPrompt && (
          <Prompt
            onClosePrompt={onClosePrompt}
            userId={userId}
            LinkedPostId={LinkedPostId}
          />
        )}
        {Hashtags && <Tags Hashtags={Hashtags} />}
        {/*<p>{content}</p> */}
      </PostItemBlock>
    </>
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
