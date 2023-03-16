import SearchOption from "../components/hashtags/SearchOption";
import HeaderContainer from "../containers/common/HeaderContainer";
import HashtagListContainer from "../containers/hashtags/HashtagListContainer";
import SearchOptionContainer from "../containers/hashtags/SearchOptionContainer";

const HashtagListPage = () => {
  return (
    <>
      <HeaderContainer />
      <HashtagListContainer />
      <SearchOptionContainer />
    </>
  );
};

export default HashtagListPage;
