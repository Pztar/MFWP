import { useParams } from "react-router-dom";
import SearchOption from "../../components/posts/SearchOption";

const SearchOptionContainer = () => {
  const { userId } = useParams();

  return <SearchOption userId={userId} />;
};

export default SearchOptionContainer;
