import qs from "qs";
import client from "./client";

export const listProducts = ({ page, category }) => {
  const queryString = qs.stringify({
    page,
    category,
  });
  return client.get(`/api/auction?${queryString}`);
};

export const registProduct = ({
  name,
  category,
  explanation,
  price,
  TerminatedAt,
}) =>
  client.post("/api/auction", {
    name,
    category,
    explanation,
    price,
    TerminatedAt,
  });

export const participateAcution = (productId) =>
  client.get(`/api/auction/${productId}`);

export const bid = () => {
  return;
};

export const removeProduct = (productId) =>
  client.delete(`/api/auction/${productId}`);
