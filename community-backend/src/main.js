require("dotenv").config();
import Koa from "koa";
import Router from "koa-router";
import api from "./api";
import bodyParser from "koa-bodyparser";
import mongoose from "mongoose";
import morgan from "koa-morgan";
import mysql from "../models";
import jwtMiddleware from "./lib/jwtMiddleware";
import cors from "@koa/cors";
import serve from "koa-static";
import path from "path";

const { PORT, MONGO_URI, MONGODB_USER, MONGODB_PASS } = process.env;

console.log("MONGODB연결 시작");
const URI = `mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGO_URI}`;
mongoose
  .connect(URI)
  .then(() => {
    console.log("MongoDB 연결성공");
  })
  .catch((e) => {
    console.error(e);
  });

console.log("MYSQL연결 시작");
mysql.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("mysql 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

const app = new Koa();
const router = new Router();

app.use(morgan("dev"));

const buildDirectory = path.resolve(__dirname, "../public");
app.use(serve(buildDirectory));
app.use(cors());
// Test를 하기 위해서 세팅 "실제 서버에 배포할 때는 아이피를 설정 해야된다."

router.use("/api", api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log("Listen to port %d", port);
});
