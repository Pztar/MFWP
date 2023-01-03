import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePost, writePost } from "../../modules/write";
import WriteActionButtons from "../../components/write/WriteActionButtons";

const WriteActionButtonsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { title, content, post, postError, originalPostId } = useSelector(
    ({ write }) => ({
      title: write.title,
      content: write.content,
      //tags: write.tags,
      post: write.post,
      postError: write.postError,
      originalPostId: write.originalPostId,
    })
  );

  const onPublish = () => {
    if (originalPostId) {
      dispatch(updatePost({ title, content, postId: originalPostId }));
      return;
    }
    dispatch(
      writePost({
        title,
        content,
        //tags,
      })
    );
  };

  const onCancle = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (post) {
      const { id, UserId } = post;
      navigate(`/${UserId}/${id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [post, postError, navigate]);

  return (
    <WriteActionButtons
      onPublish={onPublish}
      onCancle={onCancle}
      isEdit={!!originalPostId}
    />
  );
};

export default WriteActionButtonsContainer;
