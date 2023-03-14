import styled from "styled-components";
import palette from "../../lib/styles/palette";
import SubInfo from "../common/SubInfo";
import { forwardRef, useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../common/Button";
import Report from "../common/Report";

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
    background-color: ${palette.gray[5]};
  }
`;
const CommentContentBlock = styled.div`
  display: flex;
`;

const CommentContent = styled.div`
  width: 100%;
  padding-left: 0.5rem;
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
  padding-left: 0.7rem;
  border-left: 1px dashed ${palette.gray[5]}; ;
`;

const CommentInfoBlock = styled.div`
  display: flex;
  min-width: 1rem;
  font-size: 0.8rem;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: ${palette.gray[3]};
  white-space: nowrap;
  padding: 0rem 0.3rem 0.2rem;
`;

const CommentInfoButtonsBlock = styled.div`
  display: flex;
  font-size: 0.8rem;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background-color: ${palette.gray[1]};
  white-space: nowrap;
  padding: 0rem 0.3rem 0rem;
  width: 100%;

  Button {
    margin: 0.05rem;
    display: inline;
    padding: 0.2rem;
    font-size: 0.8rem;
  }
  Button + Button {
    margin-left: 1rem;
  }
`;

const CommentItem = forwardRef(
  (
    {
      comment,
      showAllComment,
      parentId,
      onChangeField,
      likeComment,
      hateComment,
      user,
    },
    postContentIndexRef
  ) => {
    const dispatch = useDispatch();
    const [reportVisible, setReportVisible] = useState(false);
    const commentId = comment.id;
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
                likeCount={comment.likes - comment.hates}
                reports={comment.reports}
              />
            </CommentSubinfoBlock>
            <CommentContentBlock>
              {showAllComment && (
                <CommentInfoBlock
                  onClick={(e) => {
                    if (comment.ordinalNumber > -1) {
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
                    }
                  }}
                  className={
                    comment.ordinalNumber >= 0
                      ? "hoverClick"
                      : "ordinalNumIsNull"
                  }
                >
                  {comment.ordinalNumber === -1 ? "" : comment.ordinalNumber}
                </CommentInfoBlock>
              )}
              <div style={{ width: "100%" }}>
                <CommentContent
                  dangerouslySetInnerHTML={{ __html: comment.content }}
                />
                {user && (
                  <CommentInfoButtonsBlock>
                    <span>
                      <Button
                        onClick={(e) => {
                          dispatch(likeComment({ commentId }));
                        }}
                        color={
                          user.likeComments.find(
                            (likeComment) => likeComment.id === commentId
                          )
                            ? `#db1414`
                            : ""
                        }
                      >
                        like
                      </Button>
                      <Button
                        onClick={(e) => {
                          dispatch(hateComment({ commentId }));
                        }}
                        color={
                          user.hateComments.find(
                            (hateComment) => hateComment.id === commentId
                          )
                            ? "#1a14db"
                            : ""
                        }
                      >
                        hate
                      </Button>
                    </span>
                    <span>
                      <Button
                        onClick={(e) => {
                          setReportVisible(true);
                        }}
                      >
                        신고
                      </Button>
                      <Report
                        reportVisible={reportVisible}
                        reportedClass="comment"
                        reportedClassId={commentId}
                        setReportVisible={setReportVisible}
                      />
                      <Button
                        onClick={(e) =>
                          onChangeField({ key: "parentId", value: comment.id })
                        }
                      >
                        답글
                      </Button>
                    </span>
                  </CommentInfoButtonsBlock>
                )}
              </div>
            </CommentContentBlock>
          </CommentItemBlock>
        </CommentItemBox>
        {comment.children ? (
          <ChildCommentBlock>
            {comment.children.map((comment) => (
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
          </ChildCommentBlock>
        ) : null}
      </>
    );
  }
);

export default CommentItem;
