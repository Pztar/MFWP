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
import mount from "koa-mount";
import path from "path";
import sse from "./sse";
import webSocket from "./socket";
import checkAuction from "./lib/checkAuction";
import send from "koa-send";
import {
  assertCSRF,
  csrfOption,
  setCsrfTokenInCookie,
} from "./lib/koaCsrfMiddleware";
import logger from "../logger";
import helmet from "helmet";
import hpp from "hpp";

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
    console.error("@mongoDB에러발생@");
  });

console.log("MYSQL연결 시작");
mysql.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("mysql 연결 성공");
  })
  .catch((err) => {
    console.error(err);
    console.error("@mySQL에러발생@");
  });

const app = new Koa();
const router = new Router();

checkAuction();
const port = PORT || 4000;

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  //app.use(helmet({ contentSecurityPolicy: false })); //서버의 각종 취약점 보완 패키지
  //app.use(hpp()); //서버의 각종 취약점 보완 패키지
  //둘다 오류 발생함 공식문서를 보고 보안 규칙 옵션 해제 필요
} else {
  app.use(morgan("dev"));
}
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// Test를 하기 위해서 세팅 "실제 서버에 배포할 때는 아이피를 설정 해야된다."

/*
const buildDirectory = path.resolve(__dirname, "../public");
app.use(serve(buildDirectory));
app.use(async (ctx) => {
  if (ctx.status === 404 && ctx.path.indexOf("/api") !== 0) {
    await send(ctx, "index.html", { root: buildDirectory });
  }
});
*/
app.use(mount("/img", serve(path.join(__dirname, "../public/uploads"))));
router.use("/api", api.routes());

//winston 에러 로그 코드
//logger.info("info 단계 이상인 에러가 발생했을때 기록하는 메세지")
//logger.error("error 단계 이상인 에러가 발생했을때 기록하는 메세지")

app.use(bodyParser());

app.use(csrfOption);
app.use(setCsrfTokenInCookie);
app.use(assertCSRF);

app.use(jwtMiddleware);

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(port, () => {
  console.log(port, "번 포트에서 대기중");
});

webSocket(server, app);
sse(server);
