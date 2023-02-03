import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { readProduct, unloadProduct } from "../../modules/product";
import Auction from "../../components/auction/Auction";

const AuctionContainer = () => {
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { search } = useLocation();
  const { product, auctions, error, loading, user } = useSelector(
    ({ product, loading, user }) => ({
      product: product.product,
      auctions: product.auctions,
      error: product.error,
      loading: loading["product/READ_PRODUCTS"],
      user: user.user,
    })
  );

  useEffect(() => {
    dispatch(readProduct(productId));
    return () => {
      dispatch(unloadProduct());
    };
  }, [dispatch, productId]);

  return (
    <Auction
      loading={loading}
      error={error}
      product={product}
      auctions={auctions}
      sendButton={user}
    />
  );
};

export default AuctionContainer;
