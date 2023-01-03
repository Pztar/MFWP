import client from "./client";

export const login = ({ email, password }) =>
  client.post("/api/auth/login", { email, password });

export const register = ({ email, nick, password }) =>
  client.post("/api/auth/register", { email, nick, password });

export const check = () => client.get("/api/auth/check");

export const logout = () => client.post("/api/auth/logout");
