import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as productsAPI from "../lib/api/products";
import { takeLatest } from "redux-saga/effects";

const INITIALIZE = "regist/INITIALIZE";
const CHANGE_FIELD = "regist/CHANGE_FIELD";
const [REGIST_PRODUCT, REGIST_PRODUCT_SUCCESS, REGIST_PRODUCT_FAILURE] =
  createRequestActionTypes("regist/WRITE_PRODUCT");
const SET_ORIGINAL_PRODUCT = "regist/SET_ORIGINAL_PRODUCT";
const [UPDATE_PRODUCT, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILURE] =
  createRequestActionTypes("regist/UPDATE_PRODUCT");

export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
export const registProduct = createAction(
  REGIST_PRODUCT,
  ({ name, category, img, explanation, price, terminatedAt }) => ({
    name,
    category,
    img,
    explanation,
    price,
    terminatedAt,
  })
);

/*
export const setOriginalPRODUCT = createAction(
  SET_ORIGINAL_PRODUCT,
  (product) => product
);

export const updateProduct = createAction(
  UPDATE_PRODUCT,
  ({ productId, name, category, img, explanation, price, terminatedAt }) => ({
    productId,
    name,
    category,
    img,
    explanation,
    price,
    terminatedAt,
  })
);
*/
const registProductSaga = createRequestSaga(
  REGIST_PRODUCT,
  productsAPI.registProduct
);
//const updateProductSaga = createRequestSaga(UPDATE_PRODUCT, productsAPI.updateProduct);

export function* registSaga() {
  yield takeLatest(REGIST_PRODUCT, registProductSaga);
  //yield takeLatest(UPDATE_PRODUCT, updateProductSaga);
}

const initialState = {
  name: "",
  category: "",
  img: "",
  explanation: "",
  price: 0,
  terminatedAt: new Date(),
  product: null,
  productError: null,
};

const regist = handleActions(
  {
    [INITIALIZE]: (state) => initialState,
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [REGIST_PRODUCT]: (state) => ({
      ...state,
      product: null,
      productError: null,
    }),
    [REGIST_PRODUCT_SUCCESS]: (state, { payload: product }) => ({
      ...state,
      product,
    }),
    [REGIST_PRODUCT_FAILURE]: (state, { payload: productError }) => ({
      ...state,
      productError,
    }),
    /*
    [SET_ORIGINAL_PRODUCT]: (state, { payload: product }) => ({
      ...state,
      title: product.title,
      content: product.content,
      originalproductId: product.id,
    }),
    [UPDATE_PRODUCT_SUCCESS]: (state, { payload: product }) => ({
      ...state,
      product,
    }),
    [UPDATE_PRODUCT_FAILURE]: (state, { payload: productError }) => ({
      ...state,
      productError,
    }),
    */
  },
  initialState
);

export default regist;
