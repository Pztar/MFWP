import { useEffect, useState } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import PostList from "../../components/posts/PostList";
import { listPosts } from "../../modules/posts";
import { listHashtags } from "../../lib/api/hashtags";
import Tags from "../../components/common/Tags";

const HashtagListContainer = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { userId } = params;
  const { search } = useLocation();
  const { loading, user } = useSelector(({ loading, user }) => ({
    loading: loading["posts/LIST_POSTS"],
    user: user.user,
  }));
  const [hashtags, setHashtags] = useState([]);
  useEffect(() => {
    const query = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    //dispatch(listPosts({ userId, query }));
    listHashtags({ query }).then((result) => setHashtags(result.data));
  }, [search]);
  console.log(hashtags);
  return <Tags loading={loading} Hashtags={hashtags} showWriteButton={user} />;
};

export default HashtagListContainer;
