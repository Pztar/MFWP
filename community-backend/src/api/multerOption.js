import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  // 저장할 장소
  destination(ctx, file, cb) {
    cb(null, "public/uploads/");
  },
  // 저장할 이미지의 파일명
  filename(ctx, file, cb) {
    const ext = path.extname(file.originalname); // 파일의 확장자
    file.originalname = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    console.log("file.originalname", file.originalname);
    // 파일명이 절대 겹치지 않도록 해줘야한다.
    // 파일이름 + 현재시간밀리초 + 파일확장자명
    cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
  },
});

const limits = { fileSize: 5 * 1024 * 1024 }; // 파일 크기 제한

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

const option = { storage, limits, fileFilter };

export default option;
