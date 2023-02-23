import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import PostViewer from "../../components/post/PostViewer";
import { removePost } from "../../lib/api/posts";
import { readPost, unloadPost } from "../../modules/post";
import { setOriginalPost } from "../../modules/write";
import PostActionButtons from "./PostAcktionButtons";

const PostViewerContainer = () => {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, comments, error, loading, user } = useSelector(
    ({ post, loading, user }) => ({
      post: post.post,
      comments: post.comments,
      error: post.error,
      loading: loading["post/READ_POST"],
      user: user.user,
    })
  );

  useEffect(() => {
    dispatch(readPost(postId));

    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate("/write");
  };

  const onRemove = async () => {
    try {
      await removePost(postId);
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  const ownPost = (user && user.id) === (post && post.UserId);

  const url = window.location.href;
  useEffect(() => {
    window.scrollBy(0, -90);
  }, [url]);

  return (
    <PostViewer
      post={post}
      comments={comments}
      loading={loading}
      error={error}
      actionButtons={
        ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
      }
    />
  );
};

export default PostViewerContainer;
