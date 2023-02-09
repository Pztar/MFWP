import Router from "koa-router";
import multer from "@koa/multer";
import multerOption from "./multerOption";
import posts from "./posts";
import auth from "./auth";
import auction from "./auction";
import room from "./room";

const api = new Router();

const upload = multer(multerOption);

const file = async (ctx, next) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  //console.log("전달받은 파일", ctx.file);
  //console.log("저장된 파일의 이름", ctx.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:4000/img/${ctx.file.filename}`;
  console.log(IMG_URL);
  ctx.body = { url: IMG_URL };
};

api.post("/file", upload.single("file"), file);
api.use("/posts", posts.routes());
api.use("/auth", auth.routes());
api.use("/auction", auction.routes());
api.use("/room", room.routes());
export default api;
