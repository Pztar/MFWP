import qs from "qs";
import client from "./client";

export const registGood = ({ title, content }) =>
  client.post("/api/auction", { title, content });

export const participateAcution = (goodId) =>
  client.get(`/api/auction/${goodId}`);

export const listGoods = ({ page, category }) => {
  const queryString = qs.stringify({
    page,
    category,
  });
  return client.get(`/api/auction?${queryString}`);
};

export const removeGood = (goodId) => client.delete(`/api/auction/${goodId}`);
