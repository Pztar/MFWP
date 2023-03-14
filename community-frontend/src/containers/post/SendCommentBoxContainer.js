import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
//import qs from "qs";
import SendCommentBox from "../../components/post/SendCommentBox";
import {
  changeField,
  writeComment,
  updateComment,
  initialize,
} from "../../modules/comment";
//import { readPost, unloadPost } from "../../modules/post";

const SendCommentBoxContainer = () => {
  const dispatch = useDispatch();
  //const { search } = useLocation();
  const { postId } = useParams();
  const navigate = useNavigate();
  const {
    ordinalNumber,
    content,
    parentId,
    comment,
    commentError,
    originalCommentId,
    postError,
  } = useSelector(({ comment, post }) => ({
    ordinalNumber: comment.ordinalNumber,
    content: comment.content,
    parentId: comment.parentId,
    comment: comment.comment,
    commentError: comment.commentError,
    originalCommentId: comment.originalCommentId,
    postError: post.error,
  }));

  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        key: name,
        value,
      })
    );
  };

  const onChangeContent = (content) => {
    dispatch(
      changeField({
        key: "content",
        value: content,
      })
    );
  };

  const onChangeField = useCallback(
    (payload) => dispatch(changeField(payload)),
    [dispatch]
  );

  const onPublish = () => {
    if (originalCommentId) {
      dispatch(
        updateComment({
          ordinalNumber,
          content,
          parentId,
          commentId: originalCommentId,
        })
      );
      return;
    }
    dispatch(writeComment({ postId, ordinalNumber, content, parentId }));
  };

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  useEffect(() => {
    if (comment) {
      //const { PostId, UserId } = comment;
      //navigate(`/posts/${UserId}/${PostId}`);
      window.location.reload();
      // const { password } = qs.parse(search, {
      //   ignoreQueryPrefix: true,
      // });
      // dispatch(readPost({ postId, password }));
    }
    if (commentError) {
      console.log(commentError);
    }
  }, [comment, commentError, navigate]);

  return (
    <SendCommentBox
      onChange={onChange}
      onChangeField={onChangeField}
      ordinalNumber={ordinalNumber}
      parentId={parentId}
      onPublish={onPublish}
      contentLength={content.length}
      postError={postError}
    />
  );
};

export default SendCommentBoxContainer;
