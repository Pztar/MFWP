import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePost, writePost } from "../../modules/write";
import WriteActionButtons from "../../components/write/WriteActionButtons";

const WriteActionButtonsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    title,
    content,
    password,
    levelLimit,
    post,
    postError,
    originalPostId,
  } = useSelector(({ write }) => ({
    title: write.title,
    content: write.content,
    password: write.password,
    levelLimit: write.levelLimit,
    //tags: write.tags,
    post: write.post,
    postError: write.postError,
    originalPostId: write.originalPostId,
  }));

  const onPublish = () => {
    if (originalPostId) {
      dispatch(
        updatePost({
          title,
          content,
          password,
          levelLimit,
          postId: originalPostId,
        })
      );
      return;
    }
    dispatch(
      writePost({
        title,
        content,
        password,
        levelLimit,
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
      navigate(`/posts/${UserId}/${id}`);
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
