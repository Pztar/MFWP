import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import qs from "qs";
import Pagination from "../../components/posts/Pagination";
import Loading from "../../components/common/Loading";

const PaginationContainer = () => {
  const { userId } = useParams();
  const { search } = useLocation();
  const { lastPage, posts, loading } = useSelector(({ posts, loading }) => ({
    lastPage: posts.lastPage,
    posts: posts.posts,
    loading: loading["posts/LIST_POSTS"],
  }));

  if (!posts || loading)
    return <Loading>포스트가 없거나 로딩 중 입니다.</Loading>;

  const { hashtag, page = 1 } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

  return (
    <Pagination
      hashtag={hashtag}
      userId={userId}
      page={parseInt(page, 10)}
      lastPage={lastPage}
    />
  );
};

export default PaginationContainer;
