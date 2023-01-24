import Router from "koa-router";
import posts from "./posts";
import auth from "./auth";
import multer from "@koa/multer";
import path from "path";

const api = new Router();

const fileFilter = (ctx, file, callback) => {
  const typeArray = file.mimetype.split("/");

  const fileType = typeArray[1]; // 이미지 확장자 추출

  //이미지 확장자 구분 검사
  if (
    fileType == "jpg" ||
    fileType == "jpeg" ||
    fileType == "png" ||
    fileType == "gif"
  ) {
    callback(null, true);
  } else {
    // return callback(new Error("*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다."), false)
    return callback(
      { message: "*.jpg, *.jpeg, *.png, *.gif 파일만 업로드가 가능합니다." },
      false
    );
  }
};

const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(ctx, file, cb) {
      cb(null, "public/uploads/");
    },
    // 저장할 이미지의 파일명
    filename(ctx, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      file.originalname = Buffer.from(file.originalname, "utf8").toString(
        "utf8"
      );
      console.log("file.originalname", file.originalname);
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한
  fileFilter: fileFilter, // 이미지 업로드 필터링 설정
});

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

api.use("/posts", posts.routes());
api.use("/auth", auth.routes());
api.post("/file", upload.single("file"), file);
export default api;
