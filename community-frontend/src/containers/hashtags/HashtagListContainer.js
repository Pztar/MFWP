import { useEffect, useState } from "react";
import qs from "qs";
//import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { listHashtags } from "../../lib/api/hashtags";
import HashtagList from "../../components/hashtags/HashtagList";

const HashtagListContainer = () => {
  //const dispatch = useDispatch();
  const params = useParams();
  const { search } = useLocation();
  //   const { loading, user } = useSelector(({ loading, user }) => ({
  //     loading: loading["posts/LIST_POSTS"],
  //     user: user.user,
  //   }));
  const [hashtags, setHashtags] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  useEffect(() => {
    const query = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    setPage(query.page);
    //dispatch(listPosts({ userId, query }));
    listHashtags({ query }).then((result) => {
      setHashtags(result.data);
      setLastPage(parseInt(result.headers["last-page"], 10));
    });
  }, [search]);
  return <HashtagList hashtags={hashtags} page={page} lastPage={lastPage} />;
};

export default HashtagListContainer;
