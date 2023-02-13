import qs from "qs";
import client from "./client";

export const listRooms = ({ page }) => {
  const queryString = qs.stringify({
    page,
  });
  return client.get(`/api/room?${queryString}`);
};

export const createRoom = ({ title, max, Owner, password }) => {
  return client.post("/api/room", {
    title,
    max,
    Owner,
    password,
  });
};

export const enterRoom = ({ roomId, inputPassword }) => {
  return client.get(`/api/room/${roomId}?password=${inputPassword}`);
};
export const removeRoom = ({ roomId }) => {
  return client.delete(`/api/room/${roomId}`);
};

export const sendChat = ({ roomId, room, user, chat }) => {
  return client.post(`/api/room/${roomId}/chat`, {
    room,
    user,
    chat,
  });
};

export const sendGif = ({ roomId }) => client.post(`/api/room/${roomId}`);
