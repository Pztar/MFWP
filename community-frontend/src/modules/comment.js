import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as postsAPI from "../lib/api/posts";
import { takeLatest } from "redux-saga/effects";

const INITIALIZE = "comment/INITIALIZE";
const CHANGE_FIELD = "comment/CHANGE_FIELD";
const [WRITE_COMMENT, WRITE_COMMENT_SUCCESS, WRITE_COMMENT_FAILURE] =
  createRequestActionTypes("comment/WRITE_COMMENT");
const SET_ORIGINAL_COMMENT = "comment/SET_ORIGINAL_COMMENT";
const [UPDATE_COMMENT, UPDATE_COMMENT_SUCCESS, UPDATE_COMMENT_FAILURE] =
  createRequestActionTypes("comment/UPDATE_COMMENT");

export const initialize = createAction(INITIALIZE);
export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
export const writeComment = createAction(
  WRITE_COMMENT,
  ({ ordinalNumber, content }) => ({
    ordinalNumber,
    content,
  })
);

export const setOriginalCommenet = createAction(
  SET_ORIGINAL_COMMENT,
  (comment) => comment
);

export const updateComment = createAction(
  UPDATE_COMMENT,
  ({ commentId, title, content }) => ({
    commentId,
    title,
    content,
  })
);

const writeCommentSaga = createRequestSaga(
  WRITE_COMMENT,
  postsAPI.writeComment
);
//const updateCommentSaga = createRequestSaga(UPDATE_COMMENT, postsAPI.updateComment);

const initialState = {
  ordinalNumber: "",
  content: "",
  comment: null,
  commentError: null,
};

const comment = handleActions(
  {
    [INITIALIZE]: (state) => initialState,
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [WRITE_COMMENT]: (state) => ({
      ...state,
      comment: null,
      commentError: null,
    }),
    [WRITE_COMMENT_SUCCESS]: (state, { payload: comment }) => ({
      ...state,
      comment,
    }),
    [WRITE_COMMENT_FAILURE]: (state, { payload: commentError }) => ({
      ...state,
      commentError,
    }),
    [UPDATE_COMMENT]: (state, { payload: comment }) => ({
      ...state,
      ordinalNumber: comment.ordinalNumber,
      content: comment.content,
      originalCommentId: comment.id,
    }),
    [UPDATE_COMMENT_SUCCESS]: (state, { payload: comment }) => ({
      ...state,
      comment,
    }),
    [UPDATE_COMMENT_FAILURE]: (state, { payload: commentError }) => ({
      ...state,
      commentError,
    }),
  },
  initialState
);

export default comment;
