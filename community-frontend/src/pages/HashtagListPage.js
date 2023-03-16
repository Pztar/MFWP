import SearchOption from "../components/hashtags/SearchOption";
import HeaderContainer from "../containers/common/HeaderContainer";
import HashtagListContainer from "../containers/hashtags/HashtagListContainer";

const HashtagListPage = () => {
  return (
    <>
      <HeaderContainer />
      <HashtagListContainer />
      <SearchOption />
    </>
  );
};

export default HashtagListPage;
