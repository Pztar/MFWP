import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProduct, registProduct } from "../../modules/registProduct";
import RegistProductButtons from "../../components/products/RegistProductButtons";

const RegistProductButtonsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    name,
    category,
    img,
    explanation,
    price,
    terminatedAt,
    product,
    productError,
    originalProductId,
  } = useSelector(({ regist }) => ({
    name: regist.name,
    category: regist.category,
    img: regist.img,
    explanation: regist.explanation,
    price: regist.price,
    terminatedAt: regist.terminatedAt,
    product: regist.product,
    ProductError: regist.postError,
    originalProductId: regist.originalPostId,
  }));

  const onPublish = () => {
    /*
    if (originalProductId) {
      dispatch(
        updateProduct({
          name,
          category,
          img,
          explanation,
          price,
          terminatedAt,
          productId: originalProductId,
        })
      );
      return;
    }
    */
    dispatch(
      registProduct({ name, category, img, explanation, price, terminatedAt })
    );
  };

  const onCancle = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (product) {
      const { id } = product;
      navigate(`/auction/${id}`);
    }
    if (productError) {
      console.log(productError);
    }
  }, [product, productError, navigate]);

  return (
    <RegistProductButtons
      onPublish={onPublish}
      onCancle={onCancle}
      isEdit={!!originalProductId}
    />
  );
};

export default RegistProductButtonsContainer;
