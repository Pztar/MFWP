import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import qs from "qs";
import PostViewer from "../../components/post/PostViewer";
import { removePost } from "../../lib/api/posts";
import { changeField } from "../../modules/comment";
import { readPost, unloadPost } from "../../modules/post";
import {
  hateComment,
  hatePost,
  likeComment,
  likePost,
} from "../../modules/user";
import { setOriginalPost } from "../../modules/write";
import PostActionButtons from "./PostAcktionButtons";

const PostViewerContainer = () => {
  const { postId } = useParams();
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { post, comments, parentId, error, loading, user } = useSelector(
    ({ post, comment, loading, user }) => ({
      post: post.post,
      comments: post.comments,
      parentId: comment.parentId,
      error: post.error,
      loading: loading["post/READ_POST"],
      user: user.user,
    })
  );

  useEffect(() => {
    const { password } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    dispatch(readPost({ postId, password }));

    return () => {
      dispatch(unloadPost());
    };
  }, [dispatch, postId]);

  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate("/posts/write");
  };

  const onRemove = async () => {
    try {
      await removePost(postId);
      navigate(-1);
    } catch (e) {
      console.log(e);
    }
  };

  const onChangeField = useCallback(
    (payload) => dispatch(changeField(payload)),
    [dispatch]
  );

  const onLikePost = () => {
    dispatch(likePost({ postId }));
  };
  const onHatePost = () => {
    dispatch(hatePost({ postId }));
  };

  const ownPost = (user && user.id) === (post && post.UserId);

  return (
    <PostViewer
      post={post}
      comments={comments}
      loading={loading}
      error={error}
      actionButtons={
        ownPost &&
        comments &&
        !comments[0] && (
          <PostActionButtons onEdit={onEdit} onRemove={onRemove} />
        )
      }
      parentId={parentId}
      onChangeField={onChangeField}
      onLikePost={onLikePost}
      onHatePost={onHatePost}
      user={user}
      likeComment={likeComment}
      hateComment={hateComment}
    />
  );
};

export default PostViewerContainer;
