import { useParams, useLocation } from "react-router-dom";
import qs from "qs";
import SearchOption from "../../components/hashtags/SearchOption";

const SearchOptionContainer = () => {
  //const { userId } = useParams();
  const { search } = useLocation();
  const { hashtag } = qs.parse(search, {
    ignoreQueryPrefix: true,
  });

  return <SearchOption hashtag={hashtag} />;
};

export default SearchOptionContainer;
