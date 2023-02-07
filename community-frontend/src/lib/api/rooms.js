import qs from "qs";
import client from "./client";

export const listRooms = ({ page }) => {
  const queryString = qs.stringify({
    page,
  });
  return client.get(`/api/auction?${queryString}`);
};

export const createRoom = ({ title, max, Owner, password }) => {
  return client.post("/api/auction/product", {
    title,
    max,
    Owner,
    password,
  });
};

export const enterRoom = (roomId) => {
  return client.get(`/api/auction/product/${roomId}`);
};
export const removeRoom = (roomId) => {
  return client.delete(`/api/auction/product/${roomId}`);
};

export const sendChat = (roomId, { room, user, chat }) => {
  return client.post(`/api/auction/product/${roomId}/bid`, {
    room,
    user,
    chat,
  });
};

export const sendGif = (roomId) => client.post(`/api/auction/${roomId}`);
