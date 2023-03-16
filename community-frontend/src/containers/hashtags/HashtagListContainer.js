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
  useEffect(() => {
    const query = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    //dispatch(listPosts({ userId, query }));
    listHashtags({ query }).then((result) => setHashtags(result.data));
  }, [search]);
  return <HashtagList hashtags={hashtags} />;
};

export default HashtagListContainer;
