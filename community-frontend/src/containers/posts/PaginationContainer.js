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
  if (lastPage === 0) return <Loading>검색된 포스트가 없습니다.</Loading>;

  const query = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

  return (
    <Pagination
      query={query}
      userId={userId}
      page={query.page ? parseInt(query.page, 10) : 1}
      lastPage={lastPage === 0 ? 1 : lastPage}
    />
  );
};

export default PaginationContainer;
