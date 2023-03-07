import HeaderContainer from "../containers/common/HeaderContainer";
import PaginationContainer from "../containers/posts/PaginationContainer";
import PostListContainer from "../containers/posts/PostListContainer";
import SearchOptionContainer from "../containers/posts/SearchOptionContainer";

const PostListPage = () => {
  return (
    <>
      <HeaderContainer />
      <PostListContainer />
      <PaginationContainer />
      <SearchOptionContainer />
    </>
  );
};

export default PostListPage;
