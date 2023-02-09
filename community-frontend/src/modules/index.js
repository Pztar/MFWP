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
import product, { productSaga } from "./product";
import rooms, { roomsSaga } from "./rooms";
import room, { roomSaga } from "./createRoom";

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  write,
  post,
  posts,
  products,
  regist,
  product,
  rooms,
  room,
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
    productSaga(),
    roomsSaga(),
    roomSaga(),
  ]);
}

export default rootReducer;
