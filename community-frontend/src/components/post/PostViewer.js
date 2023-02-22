import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";
import { Helmet } from "react-helmet-async";
import { useState } from "react";

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
  .hide {
    max-height: 0;
    overflow: hidden;
    margin: 0;
  }
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

const CommentItemBox = styled.div`
  display: flex;
  justify-content: end;
  width: 100%;
`;

const CommentItemBlock = styled.div`
  border: 1px black solid;
  width: 100%;
  padding: 0.3rem 0.5rem;
`;
const CommentSubinfo = styled(SubInfo)`
  margin-top: 0;
`;

const CommentContent = styled.div`
  width: 100%;
`;

const CommentItem = ({ comment }) => {
  return (
    <CommentItemBox>
      <CommentItemBlock>
        <CommentSubinfo
          user={comment.User}
          createdTime={new Date(comment.createdAt)}
          updatedTime={new Date(comment.updatedAt)}
          likeCount={comment.likeCount}
        />
        <CommentContent dangerouslySetInnerHTML={{ __html: comment.content }} />
      </CommentItemBlock>
    </CommentItemBox>
  );
};

const PostContentItemBlock = styled.span`
  display: flex;
  width: 100%;
`;
const PostContentIndex = styled.span`
  margin: 0.3rem;
  padding: 0.1rem;
  background-color: #e4e4e4;
  border-radius: 3px;
  width: 5%;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const PostContentItem = styled.span`
  > * {
    margin: 0.3rem auto 0.3rem;
    padding: 0.3rem auto 0.3rem;
  }
  font-size: 1.3125rem;
  color: ${palette.gray[8]};
  width: 98%;
  white-space: nowrap;

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

const PostContentFlagedComment = styled.div`
  overflow: auto;
  max-height: 30rem;
  transition: all 0.2s ease-in-out;
  //height:auto일 경우 적용 안됨 하지만 max-height값으로 적용 가능함
  margin: 0 0 1rem 2rem;
`;

const PostContent = ({ item, index, comments }) => {
  const [showFlagedComment, setShowFlagedComment] = useState(false);
  return (
    <>
      <PostContentItemBlock>
        <PostContentIndex
          onClick={(e) => {
            setShowFlagedComment(!showFlagedComment);
          }}
        >
          <div>{index}</div>
          <div>{comments && "[" + comments.length + "]"}</div>
        </PostContentIndex>
        <PostContentItem dangerouslySetInnerHTML={{ __html: item }} />
      </PostContentItemBlock>
      <PostContentFlagedComment className={showFlagedComment ? "show" : "hide"}>
        {comments &&
          comments.map((comment) => {
            return <CommentItem comment={comment} key={comment.id} />;
          })}
      </PostContentFlagedComment>
    </>
  );
};

const PostViewer = ({ post, comments, error, loading, actionButtons }) => {
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

  const regExp =
    /(<iframe.*?<\/iframe>)|(<h\d.*?<\/h\d>)|(<p.*?<\/p>)|(<ul.*?<\/ul>)|(<ol.*?<\/ol>)|(<dl.*?<\/dl>)|(<table.*?<\/table>)|(<blockquote.*?<\/blockquote>)|(<pre.*?<\/pre>)|(<img.*?<\/img>)|(<a.*?<\/a>)|(<b.*?<\/b>)|(<i.*?<\/i>)|(<u.*?<\/u>)|(<s.*?<\/s>)|(<sub.*?<\/sub>)|(<sup.*?<\/sup>)/g;
  //일반적이지 못해서 비효율적이지만 효과는 가장 좋음...
  //<태그>로 시작하고 </태그>로 끝나는 최소단위의 문자열로 나눔 //사실 pre 태그 까지만 해도 될지도...?

  let contents = content.match(regExp);
  if (contents === null) {
    contents = [content];
  }

  const comments2dArr = new Array(contents.length);

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (comment.ordinalNumber > -1 && comment.ordinalNumber < contents.length) {
      if (Array.isArray(comments2dArr[comment.ordinalNumber])) {
        comments2dArr[comment.ordinalNumber].push(comment);

        comments2dArr[comment.ordinalNumber].length =
          comments2dArr[comment.ordinalNumber].length + 1;
      } else {
        comments2dArr[comment.ordinalNumber] = [comment];
        comments2dArr[comment.ordinalNumber].length = 1;
      }
    }
  }

  return (
    <>
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
        {contents.map((item, index, arr) => (
          <PostContent
            item={item}
            index={index}
            comments={comments2dArr[index]}
            key={index}
          />
        ))}
        {comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} />
        ))}
      </PostViewerBlock>
    </>
  );
};

export default PostViewer;
