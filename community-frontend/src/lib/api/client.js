import axios from "axios";

const cookies = document.cookie.split(";");
const csrfTokenCookie = cookies.find((cookie) =>
  cookie.trim().startsWith("csrfToken=")
);
const csrfToken = csrfTokenCookie ? csrfTokenCookie.split("=")[1] : null;

const client = axios.create();
client.defaults.headers.common["X-CSRF-Token"] = csrfToken;

export default client;
