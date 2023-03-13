import qs from "qs";
import client from "./client";

export const writePost = ({ title, content, password, levelLimit }) =>
  client.post("/api/posts", { title, content, password, levelLimit });

export const readPost = ({ postId, password }) =>
  client.get(`/api/posts/${postId}?password=${password}`);

export const listPosts = ({ userId, query }) => {
  const queryString = qs.stringify({
    userId,
    ...query,
  });
  return client.get(`/api/posts?${queryString}`);
};

export const updatePost = ({ postId, title, content, password, levelLimit }) =>
  client.patch(`/api/posts/${postId}`, {
    title,
    content,
    password,
    levelLimit,
  });

export const removePost = (postId) => client.delete(`/api/posts/${postId}`);

export const writeComment = ({ postId, ordinalNumber, content, parentId }) =>
  client.post(`/api/posts/${postId}/comment`, {
    ordinalNumber,
    content,
    parentId,
  });
