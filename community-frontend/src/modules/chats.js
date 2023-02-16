import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {
  createRequestActionTypes,
} from "../lib/createRequestSaga";
import * as roomsAPI from "../lib/api/rooms";
import { takeLatest } from "redux-saga/effects";

const [ENTER_ROOM, ENTER_ROOM_SUCCESS, ENTER_ROOM_FAILURE] =
  createRequestActionTypes("chats/ENTER_ROOM");
const LIST_ONLINES = "chats/LIST_ONLINES";
const CONCAT_CHATS = "chats/CONCAT_CHATS";

export const enterRoom = createAction(
  ENTER_ROOM,
  ({ roomId, inputPassword }) => ({
    roomId,
    inputPassword,
  })
);

export const listOnlines = createAction(LIST_ONLINES, ({ onlines }) => ({
  onlines,
}));

export const concatChats = createAction(CONCAT_CHATS, ({ newChat }) => ({
  newChat,
}));

const enterRoomSaga = createRequestSaga(ENTER_ROOM, roomsAPI.enterRoom);

export function* chatsSaga() {
  yield takeLatest(ENTER_ROOM, enterRoomSaga);
}

const initialState = {
  room: null,
  chats: null,
  onlines: null,
  error: null,
};

const chats = handleActions(
  {
    [ENTER_ROOM_SUCCESS]: (
      state,
      { payload: roomAndChats, meta: response }
    ) => ({
      ...state,
      room: roomAndChats.room,
      chats: roomAndChats.chats,
    }),
    [ENTER_ROOM_FAILURE]: (state, { payload: error }) => ({
      ...state,
      error,
    }),
    [LIST_ONLINES]: (state, { payload: { onlines } }) => ({
      ...state,
      onlines,
    }),

    [CONCAT_CHATS]: (state, { payload: { newChat } }) => ({
      ...state,
      chats: [...state.chats, newChat],
    }),
  },
  initialState
);

export default chats;
