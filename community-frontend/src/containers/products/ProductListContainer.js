import { useEffect } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import ProductList from "../../components/products/productList";
import { listProducts } from "../../modules/products";

const ProductListContainer = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { search } = useLocation();
  const { products, error, loading, user } = useSelector(
    ({ products, loading, user }) => ({
      products: products.products,
      error: products.error,
      loading: loading["products/LIST_PRODUCTS"],
      user: user.user,
    })
  );

  useEffect(() => {
    const { category } = params;
    const { page } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });

    dispatch(listProducts({ page, category }));
  }, [dispatch, search, params]);

  return (
    <ProductList
      loading={loading}
      error={error}
      products={products}
      showRegistProductButton={user}
    />
  );
};

export default ProductListContainer;
