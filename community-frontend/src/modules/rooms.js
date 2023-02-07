import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as productsAPI from "../lib/api/";
import { takeLatest } from "redux-saga/effects";

const [LIST_ROOMS, LIST_ROOMS_SUCCESS, LIST_ROOMS_FAILURE] =
  createRequestActionTypes("products/LIST_PRODUCTS");

export const listRooms = createAction(LIST_ROOMS, ({ category, page }) => ({
  category,
  page,
}));

const listRoomsSaga = createRequestSaga(LIST_ROOMS, productsAPI.listProducts);
export function* productsSaga() {
  yield takeLatest(LIST_ROOMS, listRoomsSaga);
}

const initialState = {
  products: null,
  error: null,
  lastPage: 1,
};

const products = handleActions(
  {
    [LIST_ROOMS_SUCCESS]: (state, { payload: products, meta: response }) => ({
      ...state,
      products,
      lastPage: parseInt(response.headers["last-page"], 10),
    }),
    [LIST_ROOMS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default products;
