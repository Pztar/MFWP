import qs from "qs";
import client from "./client";

export const writePost = ({ title, content }) =>
  client.post("/api/posts", { title, content });

export const readPost = (postId) => client.get(`/api/posts/${postId}`);

export const listPosts = ({ page, userId, hashtag }) => {
  const queryString = qs.stringify({
    page,
    userId,
    hashtag,
  });
  return client.get(`/api/posts?${queryString}`);
};

export const updatePost = ({ postId, title, content }) =>
  client.patch(`/api/posts/${postId}`, {
    title,
    content,
  });

export const removePost = (postId) => client.delete(`/api/posts/${postId}`);
