import HeaderContainer from "../containers/common/HeaderContainer";
import PostViewerContainer from "../containers/post/PostViewerContainer";
import SendCommentBoxContainer from "../containers/post/SendCommentBoxContainer";

const PostPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostViewerContainer />
      <SendCommentBoxContainer />
    </>
  );
};

export default PostPage;
