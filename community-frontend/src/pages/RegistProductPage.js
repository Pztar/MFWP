import Responsive from "../components/common/Responsive";
import RegistProductContainer from "../containers/products/RegistProductContainer";
import RegistProductButtonsContainer from "../containers/products/RegistProductButtonContainer";
import { Helmet } from "react-helmet-async";

const RegistProductPage = () => {
  return (
    <Responsive>
      <Helmet>
        <title>상품 등록하기 - REACTERS</title>
      </Helmet>
      <RegistProductContainer />
      <RegistProductButtonsContainer />
    </Responsive>
  );
};

export default RegistProductPage;
