import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RegistProduct from "../../components/products/RegistProduct";
import { changeField, initialize } from "../../modules/registProduct";

const RegistProductContainer = () => {
  const dispatch = useDispatch();
  const { name, category, img, explanation, price, terminatedAt } = useSelector(
    ({ regist }) => ({
      name: regist.name,
      category: regist.category,
      img: regist.img,
      explanation: regist.explanation,
      price: regist.price,
      terminatedAt: regist.terminatedAt,
    })
  );

  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        key: name,
        value,
      })
    );
  };

  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);
  return (
    <RegistProduct
      onChange={onChange}
      changeField={changeField}
      name={name}
      category={category}
      img={img}
      explanation={explanation}
      price={price}
      terminatedAt={terminatedAt}
    />
  );
};

export default RegistProductContainer;
