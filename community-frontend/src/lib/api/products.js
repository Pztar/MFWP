import qs from "qs";
import client from "./client";

export const registProduct = ({ title, content }) =>
  client.post("/api/auction", { title, content });

export const participateAcution = (productId) =>
  client.get(`/api/auction/${productId}`);

export const listProducts = ({ page, category }) => {
  const queryString = qs.stringify({
    page,
    category,
  });
  return client.get(`/api/auction?${queryString}`);
};

export const removeProduct = (productId) =>
  client.delete(`/api/auction/${productId}`);
