import { useEffect } from "react";
import qs from "qs";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import GoodList from "../../components/goods/goodsList";
import { listGoods } from "../../modules/goods";

const GoodsListContainer = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { search } = useLocation();
  const { goods, error, loading, user } = useSelector(
    ({ goods, loading, user }) => ({
      goods: goods.goods,
      error: goods.error,
      loading: loading["goods/LIST_GOODS"],
      user: user.user,
    })
  );

  useEffect(() => {
    const { category } = params;
    const { page } = qs.parse(search, {
      ignoreQueryPrefix: true,
    });

    dispatch(listGoods({ page, category }));
  }, [dispatch, search, params]);

  return (
    <GoodList
      loading={loading}
      error={error}
      goods={goods}
      showRegistGoodButton={user}
    />
  );
};

export default GoodsListContainer;
