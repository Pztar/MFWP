import qs from "qs";
import client from "./client";

export const listHashtags = async ({ query }) => {
  const queryString = qs.stringify({
    ...query,
  });
  return await client.get(`/api/hashtags?${queryString}`);
};
