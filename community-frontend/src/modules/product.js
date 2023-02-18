import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as productsAPI from "../lib/api/products";
import { takeLatest } from "redux-saga/effects";

const [READ_PRODUCT, READ_PRODUCT_SUCCESS, READ_PRODUCT_FIALURE] =
  createRequestActionTypes("product/READ_PRODUCT");
const UNLOAD_PRODUCT = "product/UNLOAD_PRODUCT";
const CONCAT_AUCTION = "product/CONCAT_AUCTION";

export const readProduct = createAction(READ_PRODUCT, (productId) => productId);
export const unloadProduct = createAction(UNLOAD_PRODUCT);
export const concatAuction = createAction(CONCAT_AUCTION, (data) => data);

const readProductSaga = createRequestSaga(
  READ_PRODUCT,
  productsAPI.participateAuction
);
export function* productSaga() {
  yield takeLatest(READ_PRODUCT, readProductSaga);
}

const initialState = {
  product: null,
  auctions: null,
  error: null,
};

const product = handleActions(
  {
    [READ_PRODUCT_SUCCESS]: (state, { payload: productAuction }) => ({
      ...state,
      product: productAuction.product,
      auctions: productAuction.auctions,
    }),
    [READ_PRODUCT_FIALURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [UNLOAD_PRODUCT]: () => initialState,
    [CONCAT_AUCTION]: (state, { payload: data }) => ({
      ...state,
      auctions: [...state.auctions, data],
    }),
  },
  initialState
);

export default product;
