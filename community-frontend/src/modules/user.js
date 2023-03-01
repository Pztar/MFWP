import { createAction, handleActions } from "redux-actions";
import { takeLatest, call } from "redux-saga/effects";
import * as authAPI from "../lib/api/auth";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";

const TEMP_SET_USER = "user/TEMP_SET_USER";
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] =
  createRequestActionTypes("user/CHECK");
const LOGOUT = "user/LOGOUT";

const [LIKE_POST, LIKE_POST_SUCCESS, LIKE_POST_FAILURE] =
  createRequestActionTypes("user/LIKE_POST");
const [HATE_POST, HATE_POST_SUCCESS, HATE_POST_FAILURE] =
  createRequestActionTypes("user/HATE_POST");
const [LIKE_COMMENT, LIKE_COMMENT_SUCCESS, LIKE_COMMENT_FAILURE] =
  createRequestActionTypes("user/LIKE_COMMENT");
const [HATE_COMMENT, HATE_COMMENT_SUCCESS, HATE_COMMENT_FAILURE] =
  createRequestActionTypes("user/HATE_COMMENT");

export const tempSetUser = createAction(TEMP_SET_USER, (user) => user);
export const check = createAction(CHECK);
export const logout = createAction(LOGOUT);

export const likePost = createAction(LIKE_POST, ({ postId }) => ({
  postId,
}));
export const hatePost = createAction(HATE_POST, ({ postId }) => ({
  postId,
}));
export const likeComment = createAction(LIKE_COMMENT, ({ commentId }) => ({
  commentId,
}));
export const hateComment = createAction(HATE_COMMENT, ({ commentId }) => ({
  commentId,
}));

const checkSaga = createRequestSaga(CHECK, authAPI.check);

const likePostSaga = createRequestSaga(LIKE_POST, authAPI.likePost);
const hatePostSaga = createRequestSaga(HATE_POST, authAPI.hatePost);
const likeCommentSaga = createRequestSaga(LIKE_COMMENT, authAPI.likeComment);
const hateCommentSaga = createRequestSaga(HATE_COMMENT, authAPI.hateComment);

function checkFailureSaga() {
  try {
    localStorage.removeItem("user");
  } catch (e) {
    console.log("localStorage is not working");
  }
}

function* logoutSaga() {
  try {
    yield call(authAPI.logout);
    localStorage.removeItem("user");
  } catch (e) {
    console.log(e);
  }
}

export function* userSaga() {
  yield takeLatest(CHECK, checkSaga);
  yield takeLatest(CHECK_FAILURE, checkFailureSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(LIKE_POST, likePostSaga);
  yield takeLatest(HATE_POST, hatePostSaga);
  yield takeLatest(LIKE_COMMENT, likeCommentSaga);
  yield takeLatest(HATE_COMMENT, hateCommentSaga);
}

const initialState = {
  user: null,
  checkError: null,
  associateError: null,
};

export default handleActions(
  {
    [TEMP_SET_USER]: (state, { payload: user }) => ({
      ...state,
      user,
    }),
    [CHECK_SUCCESS]: (state, { payload: user }) => ({
      ...state,
      user,
      checkError: null,
    }),
    [CHECK_FAILURE]: (state, { payload: error }) => ({
      ...state,
      user: null,
      checkError: error,
    }),
    [LOGOUT]: (state) => ({
      ...state,
      user: null,
    }),
    /////////////////////////////////////////////////////////////////////
    [LIKE_POST_SUCCESS]: (state, { payload: likePosts }) => ({
      ...state,
      user: { ...state.user, likePosts: likePosts },
      associateError: null,
    }),
    [LIKE_POST_FAILURE]: (state, { payload: error }) => ({
      ...state,
      associateError: error,
    }),
    [HATE_POST_SUCCESS]: (state, { payload: hatePosts }) => ({
      ...state,
      user: { ...state.user, hatePosts: hatePosts },
      associateError: null,
    }),
    [HATE_POST_FAILURE]: (state, { payload: error }) => ({
      ...state,
      associateError: error,
    }),
    [LIKE_COMMENT_SUCCESS]: (state, { payload: likeComments }) => ({
      ...state,
      user: { ...state.user, likeComments: likeComments },
      associateError: null,
    }),
    [LIKE_COMMENT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      associateError: error,
    }),
    [HATE_COMMENT_SUCCESS]: (state, { payload: hateComments }) => ({
      ...state,
      user: { ...state.user, hateComments: hateComments },
      associateError: null,
    }),
    [HATE_COMMENT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      associateError: error,
    }),
  },
  initialState
);
