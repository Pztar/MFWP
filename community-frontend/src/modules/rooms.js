import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as roomsAPI from "../lib/api/rooms";
import { takeLatest } from "redux-saga/effects";

const [LIST_ROOMS, LIST_ROOMS_SUCCESS, LIST_ROOMS_FAILURE] =
  createRequestActionTypes("rooms/LIST_ROOMS");

export const listRooms = createAction(LIST_ROOMS, ({ page }) => ({
  page,
}));

const listRoomsSaga = createRequestSaga(LIST_ROOMS, roomsAPI.listRooms);
export function* roomsSaga() {
  yield takeLatest(LIST_ROOMS, listRoomsSaga);
}

const initialState = {
  rooms: null,
  error: null,
  lastPage: 1,
};

const rooms = handleActions(
  {
    [LIST_ROOMS_SUCCESS]: (state, { payload: rooms, meta: response }) => ({
      ...state,
      rooms,
      lastPage: parseInt(response.headers["last-page"], 10),
    }),
    [LIST_ROOMS_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
  },
  initialState
);

export default rooms;
