import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import SendCommentBox from "../../components/post/SendCommentBox";
import {
  changeField,
  writeComment,
  updateComment,
  initialize,
} from "../../modules/comment";

const SendCommentBoxContainer = () => {
  const dispatch = useDispatch();
  const { postId } = useParams();
  const navigate = useNavigate();
  const { ordinalNumber, content, comment, commentError, originalCommentId } =
    useSelector(({ comment }) => ({
      ordinalNumber: comment.ordinalNumber,
      content: comment.content,
      comment: comment.comment,
      commentError: comment.commentError,
      originalCommentId: comment.originalCommentId,
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
        updateComment({ ordinalNumber, content, commentId: originalCommentId })
      );
      return;
    }
    dispatch(writeComment({ postId, ordinalNumber, content }));
  };

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  useEffect(() => {
    if (comment) {
      const { PostId, UserId } = comment;
      navigate(`/${UserId}/${PostId}`);
      window.location.reload();
    }
    if (commentError) {
      console.log(commentError);
    }
  }, [comment, commentError, navigate]);

  return (
    <SendCommentBox
      onChange={onChange}
      onChangeContent={onChangeContent}
      onChangeField={onChangeField}
      ordinalNumber={ordinalNumber}
      content={content}
      onPublish={onPublish}
    />
  );
};

export default SendCommentBoxContainer;
