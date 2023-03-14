import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import SubInfo from "../common/SubInfo";
import Tags from "../common/Tags";
import { Helmet } from "react-helmet-async";
import { forwardRef, useEffect, useRef, useState } from "react";
import Button from "../common/Button";
import Report from "../common/Report";
import CommentItem from "./CommentItem";

const PostViewerBlock = styled(Responsive)`
  margin-top: 3rem;
  .hide {
    max-height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  .hoverClick {
    &:hover {
      cursor: zoom-in;
    }
  }
`;

const PostHead = styled.div`
  border-bottom: 1px solid ${palette.gray[2]};
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  h1 {
    font-size: 3rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const LikesBlock = styled.div`
  display: flex;
  justify-content: center;
  Button + Button {
    margin-left: 1rem;
  }
`;

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

const PostContentFlagedComments = styled.div`
  overflow: auto;
  max-height: 33rem;
  transition: all 0.2s ease-in-out;
  //height:auto일 경우 적용 안됨 하지만 max-height값으로 적용 가능함
  margin: 0 0 1rem 1rem;
  box-shadow: inset 0px 0px 5px 0px black;
  padding: 0.3rem 0.3rem 0.5rem 1rem;
`;

const PostContent = forwardRef(
  (
    {
      item,
      index,
      comments,
      parentId,
      onChangeField,
      likeComment,
      hateComment,
      user,
    },
    postContentIndexRef
  ) => {
    const [showFlagedComment, setShowFlagedComment] = useState(false);
    const [commentPage, setCommentPage] = useState(1);
    const [slicedComments, setSlicedComments] = useState([]);

    const commentPerPage = 5;
    useEffect(() => {
      if (comments) {
        setSlicedComments(
          comments.slice(
            commentPerPage * (commentPage - 1),
            commentPerPage * commentPage
          )
        );
      }
    }, [comments, commentPage]);
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
        <PostContentFlagedComments
          className={showFlagedComment ? "show" : "hide"}
        >
          {comments &&
            slicedComments.map((comment) => {
              return (
                <CommentItem
                  comment={comment}
                  key={comment.id}
                  ref={postContentIndexRef}
                  parentId={parentId}
                  onChangeField={onChangeField}
                  likeComment={likeComment}
                  hateComment={hateComment}
                  user={user}
                />
              );
            })}
          <CommentPagenation>
            {" "}
            <Button
              onClick={(e) => {
                if (commentPage > 1) {
                  setCommentPage(commentPage - 1);
                }
              }}
            >
              이전
            </Button>
            <span>{commentPage}</span>
            <Button
              onClick={(e) => {
                if (comments[commentPage * commentPerPage]) {
                  setCommentPage(commentPage + 1);
                }
              }}
            >
              다음
            </Button>
          </CommentPagenation>
          <Button
            onClick={(e) => {
              onChangeField({ key: "ordinalNumber", value: `${index}` });
              //value를 string으로 입력해야 ordinalNumber이 0일때 오류가 나지 않음
            }}
            style={{
              margin: "0.3rem 0.5rem",
              fontSize: "0.9rem",
              padding: "0.1rem 1rem",
            }}
          >
            문단에 댓글 달기
          </Button>
        </PostContentFlagedComments>
      </>
    );
  }
);

const CommentsBlock = styled.div`
  padding-top: 0.3rem;
  margin-top: 1rem;
  width: 100%;
  border-top: 1px black inset;
`;

const ReportButton = styled.button`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: ${palette.gray[6]};
  font-weight: bold;
  border: none;
  outline: none;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: ${palette.gray[1]};
    color: #e30000;
  }

  & + & {
    margin-left: 0.25rem;
  }
`;

const CommentPagenation = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  span {
    margin: 0rem 2rem;
  }
  Button {
    font-size: 0.9rem;
  }
`;

const PostViewer = ({
  post,
  comments,
  parentId,
  error,
  loading,
  actionButtons,
  onChangeField,
  onLikePost,
  onHatePost,
  user,
  likeComment,
  hateComment,
}) => {
  const postContentIndexRef = useRef([]);
  const [reportVisible, setReportVisible] = useState(false);
  const [commentPage, setCommentPage] = useState(1);
  const [slicedComments, setSlicedComments] = useState([]);

  const commentPerPage = 5;
  useEffect(() => {
    if (comments) {
      setSlicedComments(
        comments.slice(
          commentPerPage * (commentPage - 1),
          commentPerPage * commentPage
        )
      );
    }
  }, [comments, commentPage]);

  //const onCancle = setReportVisible(false);

  if (error) {
    if (error.response && error.response.status === 404) {
      return <PostViewerBlock>존재하지 않는 포스트입니다.</PostViewerBlock>;
    } else if (error.response && error.response.status === 406) {
      return <PostViewerBlock>비밀번호가 올바르지 않습니다.</PostViewerBlock>;
    } else if (error.response && error.response.status === 412) {
      return <PostViewerBlock>레벨이 부족합니다.</PostViewerBlock>;
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
    views,
    likes,
    hates,
    reports,
    createdAt,
    updatedAt,
    User,
    Hashtags,
  } = post;
  const postId = id;
  const likeCount = likes - hates;

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
            reports={reports}
            views={views}
            hasMarginTop
          />
          <Tags Hashtags={Hashtags} />
        </PostHead>
        {user && (
          <>
            <ReportButton
              onClick={(e) => {
                setReportVisible(true);
              }}
            >
              신고
            </ReportButton>
            <Report
              reportVisible={reportVisible}
              reportedClass="post"
              reportedClassId={postId}
              setReportVisible={setReportVisible}
            />
          </>
        )}

        {actionButtons}
        {contents.map((item, index, arr) => (
          <PostContent
            item={item}
            index={index}
            comments={comments2dArr[index]}
            key={index}
            ref={postContentIndexRef}
            parentId={parentId}
            onChangeField={onChangeField}
            likeComment={likeComment}
            hateComment={hateComment}
            user={user}
          />
        ))}
        {user && (
          <LikesBlock>
            <Button
              onClick={onLikePost}
              color={
                user.likePosts.find((likePost) => likePost.id === postId)
                  ? `#db1414`
                  : ""
              }
            >
              like
            </Button>
            <Button
              onClick={onHatePost}
              color={
                user.hatePosts.find((hatePost) => hatePost.id === postId)
                  ? "#1a14db"
                  : ""
              }
            >
              hate
            </Button>
          </LikesBlock>
        )}
        <CommentsBlock>
          {`<댓글 [${comments.length}]>`}
          {slicedComments.map((comment) => (
            <CommentItem
              comment={comment}
              key={comment.id}
              showAllComment={comment.ordinalNumber > -1 && "true"}
              ref={postContentIndexRef}
              parentId={parentId}
              onChangeField={onChangeField}
              likeComment={likeComment}
              hateComment={hateComment}
              user={user}
            />
          ))}
          <CommentPagenation>
            {" "}
            <Button
              onClick={(e) => {
                if (commentPage > 1) {
                  setCommentPage(commentPage - 1);
                }
              }}
            >
              이전
            </Button>
            <span>{commentPage}</span>
            <Button
              onClick={(e) => {
                if (comments[commentPage * commentPerPage]) {
                  setCommentPage(commentPage + 1);
                }
              }}
            >
              다음
            </Button>
          </CommentPagenation>
        </CommentsBlock>
      </PostViewerBlock>
    </>
  );
};

export default PostViewer;
