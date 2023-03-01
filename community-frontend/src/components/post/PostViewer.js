import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";
import { Helmet } from "react-helmet-async";
import { forwardRef, useRef, useState } from "react";
import Button from "../common/Button";

const PostViewerBlock = styled(Responsive)`
  margin-top: 4rem;
  .hide {
    max-height: 0;
    overflow: hidden;
    margin: 0;
  }
  .hoverClick {
    &:hover {
      cursor: zoom-in;
    }
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
  padding: 0;
  overflow: auto;
`;
const CommentSubinfoBlock = styled.div`
  padding: 0.2rem 0.5rem 0.2rem;
  min-width: 10rem;
  border-bottom: 1px solid ${palette.gray[2]};
  > * {
    color: ${palette.gray[8]};
  }

  &.recommenting {
    background-color: ${palette.gray[3]};
  }
`;
const CommentContentBlock = styled.div`
  display: flex;
`;

const CommentInfoBlock = styled.div`
  display: flex;
  width: 2rem;
  font-size: 0.8rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${palette.gray[1]};
  white-space: nowrap;
  &.recommendButton {
    &:hover {
      cursor: pointer;
    }
  }
`;
const CommentContent = styled.div`
  width: 100%;
  padding-left: 0.5rem;
  //max-height: 20rem;
  min-width: 15.5rem;
  p {
    margin: 0.3rem auto;
  }
  img {
    max-width: 100%;
    max-height: 100%;
  }
  iframe {
    max-width: 100%;
    aspect-ratio: auto 16 / 9;
    background: gray;
  }
`;

const ChildCommentBlock = styled.div`
  padding-left: 1rem;
  border-left: 1px dashed ${palette.gray[5]}; ;
`;

const CommentItem = forwardRef(
  (
    { comment, showAllComment, parentId, onSetParentId },
    postContentIndexRef
  ) => {
    return (
      <>
        <CommentItemBox>
          <CommentItemBlock>
            <CommentSubinfoBlock
              className={parentId === comment.id && "recommenting"}
            >
              <SubInfo
                user={comment.User}
                createdTime={new Date(comment.createdAt)}
                updatedTime={new Date(comment.updatedAt)}
                likeCount={comment.likeCount}
              />
            </CommentSubinfoBlock>
            <CommentContentBlock>
              {showAllComment && (
                <CommentInfoBlock
                  onClick={(e) => {
                    const element =
                      postContentIndexRef.current[comment.ordinalNumber];
                    //.scrollIntoView({behavior: "smooth",block: "start",inline: "nearest",});
                    //편리한 방법이지만 헤더가 display:fixed일 경우 가려짐
                    const yOffset = -90;
                    const y =
                      element.getBoundingClientRect().top +
                      window.pageYOffset +
                      yOffset;

                    window.scrollTo({ top: y, behavior: "smooth" });
                  }}
                  className={
                    comment.ordinalNumber >= 0
                      ? "hoverClick"
                      : "ordinalNumIsNull"
                  }
                >
                  {comment.ordinalNumber === -1
                    ? "null"
                    : comment.ordinalNumber}
                </CommentInfoBlock>
              )}
              <CommentContent
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
              <CommentInfoBlock
                className="recommendButton"
                onClick={(e) =>
                  onSetParentId({ key: "parentId", value: comment.id })
                }
              >
                답글
              </CommentInfoBlock>
            </CommentContentBlock>
          </CommentItemBlock>
        </CommentItemBox>
        {comment.children ? (
          <ChildCommentBlock>
            {comment.children.map((comment) => (
              <CommentItem
                comment={comment}
                key={comment.id}
                showAllComment="true"
                ref={postContentIndexRef}
                parentId={parentId}
                onSetParentId={onSetParentId}
              />
            ))}
          </ChildCommentBlock>
        ) : null}
      </>
    );
  }
);

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

const PostContent = forwardRef(
  ({ item, index, comments, parentId, onSetParentId }, postContentIndexRef) => {
    const [showFlagedComment, setShowFlagedComment] = useState(false);
    return (
      <>
        <PostContentItemBlock>
          <PostContentIndex
            onClick={(e) => {
              setShowFlagedComment(!showFlagedComment);
            }}
          >
            <div ref={(el) => (postContentIndexRef.current[index] = el)}>
              {index}
            </div>
            <div className="hoverClick">
              {comments && "[" + comments.length + "]"}
            </div>
          </PostContentIndex>
          <PostContentItem dangerouslySetInnerHTML={{ __html: item }} />
        </PostContentItemBlock>
        <PostContentFlagedComment
          className={showFlagedComment ? "show" : "hide"}
        >
          {comments &&
            comments.map((comment) => {
              return (
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  parentId={parentId}
                  onSetParentId={onSetParentId}
                />
              );
            })}
        </PostContentFlagedComment>
      </>
    );
  }
);

const LikesBlock = styled.div`
  display: flex;
  justify-content: center;
  Button + Button {
    margin-left: 1rem;
  }
`;

const CommentsBlock = styled.div`
  padding-top: 0.3rem;
  margin-top: 1rem;
  width: 100%;
  border-top: 1px black inset;
`;

const PostViewer = ({
  post,
  comments,
  parentId,
  error,
  loading,
  actionButtons,
  onSetParentId,
  onLikePost,
  onHatePost,
}) => {
  const postContentIndexRef = useRef([]);

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
            ref={postContentIndexRef}
            parentId={parentId}
            onSetParentId={onSetParentId}
          />
        ))}
        <LikesBlock>
          <Button onClick={onLikePost}>like</Button>
          <Button onClick={onHatePost}>hate</Button>
        </LikesBlock>
        <CommentsBlock>
          {"<"}댓글{">"}
          {comments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment.id}
              showAllComment="true"
              ref={postContentIndexRef}
              parentId={parentId}
              onSetParentId={onSetParentId}
            />
          ))}
        </CommentsBlock>
      </PostViewerBlock>
    </>
  );
};

export default PostViewer;
