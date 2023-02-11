import { createAction, handleActions } from "redux-actions";
import { takeLatest } from "redux-saga/effects";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as roomsAPI from "../lib/api/rooms";

const CHANGE_FIELD = "createRoom/CHANGE_FIELD";
const INITIALIZE = "createRoom/INITIALIZE";

const [CREATE_ROOM, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAILURE] =
  createRequestActionTypes("createRoom/CREATE_ROOM");

export const changeField = createAction(CHANGE_FIELD, ({ key, value }) => ({
  key,
  value,
}));
export const initialize = createAction(INITIALIZE);

export const createRoom = createAction(
  CREATE_ROOM,
  ({ title, max, password }) => ({
    title,
    max,
    password,
  })
);

const createRoomSaga = createRequestSaga(CREATE_ROOM, roomsAPI.createRoom);

export function* roomSaga() {
  yield takeLatest(CREATE_ROOM, createRoomSaga);
}

const initialState = {
  title: "",
  max: "",
  password: "",
  room: null,
  roomError: null,
};

const room = handleActions(
  {
    [CHANGE_FIELD]: (state, { payload: { key, value } }) => ({
      ...state,
      [key]: value,
    }),
    [INITIALIZE]: (state) => initialState,
    [CREATE_ROOM]: (state) => ({
      ...state,
      room: null,
      roomError: null,
    }),
    [CREATE_ROOM_SUCCESS]: (state, { payload: newRoom }) => ({
      ...state,
      room: newRoom,
    }),

    [CREATE_ROOM_FAILURE]: (state, { payload: error }) => ({
      ...state,
      roomError: error,
    }),
  },
  initialState
);

export default room;
