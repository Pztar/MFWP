import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import ProductList from "../../components/products/ProductList";
import { listProducts } from "../../modules/products";
import { useEffect, useState } from "react";
import useScript from "../../useScript";

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
    const { productId } = params;
    const { page, category } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });

    dispatch(listProducts({ productId, page, category }));
  }, [dispatch, search, params]);

  useScript("https://unpkg.com/event-source-polyfill/src/eventsource.min.js");

  const [listening, setListening] = useState(false);
  const [serverTime, setServerTime] = useState(null);

  useEffect(() => {
    const es = new EventSource("/sse");
    if (!listening) {
      es.onopen = (event) => {
        console.log("sse connection opened");
      };
      es.onmessage = function (e) {
        setServerTime(e.data);
      };
      es.onerror = (event) => {
        console.log(event.target.readyState);
        if (event.target.readyState === EventSource.CLOSED) {
          console.log("eventsource closed (" + event.target.readyState + ")");
        }
        es.close();
      };

      setListening(true);
    }

    return () => {
      es.close();
      console.log("eventsource closed");
    };
  }, []);

  return (
    <ProductList
      loading={loading}
      error={error}
      products={products}
      showRegistProductButton={user}
      serverTime={serverTime}
    />
  );
};

export default ProductListContainer;
