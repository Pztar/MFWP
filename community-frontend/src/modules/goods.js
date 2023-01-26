import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as goodsAPI from "../lib/api/goods";
import { takeLatest } from "redux-saga/effects";

const [LIST_GOODS, LIST_GOODS_SUCCESS, LIST_GOODS_FAILURE] =
  createRequestActionTypes("goods/LIST_GOODS");

export const listGoods = createAction(LIST_GOODS, ({ category, page }) => ({
  category,
  page,
}));

//const listGoodsSaga = createRequestSaga(LIST_GOODS, goodsAPI.listGoods);
export function* goodsSaga() {
  //yield takeLatest(LIST_GOODS, listGoodsSaga);
}

const initialState = {
  goods: null,
  error: null,
  lastPage: 1,
};

const goods = handleActions(
  {
    [LIST_GOODS_SUCCESS]: (state, { payload: goods, meta: response }) => ({
      ...state,
      goods,
      lastPage: parseInt(response.headers["last-page"], 10),
    }),
    [LIST_GOODS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default goods;
