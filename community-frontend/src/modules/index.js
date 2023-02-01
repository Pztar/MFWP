import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import auth, { authSaga } from "./auth";
import loading from "./loading";
import post, { postSaga } from "./post";
import posts, { postsSaga } from "./posts";
import user, { userSaga } from "./user";
import write, { writeSaga } from "./write";
import products, { productsSaga } from "./products";
import regist, { registSaga } from "./registProduct";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  write,
  post,
  posts,
  products,
  regist,
});

export function* rootSaga() {
  yield all([
    authSaga(),
    userSaga(),
    writeSaga(),
    postSaga(),
    postsSaga(),
    productsSaga(),
    registSaga(),
  ]);
}

export default rootReducer;
