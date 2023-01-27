import Router from "koa-router";
import fs from "fs";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as auctionCtrl from "./auction.ctrl";
import multer from "@koa/multer";
import multerOption from "../multerOption";

const upload = multer(multerOption);

const auction = new Router();
/*
auction.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
*/
auction.get("/", auctionCtrl.listProducts);

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

auction.post(
  "/product",
  checkLoggedIn,
  upload.single("file"),
  auctionCtrl.createProduct
);

auction.get(
  "/product/:productId",
  checkLoggedIn,
  auctionCtrl.participateAcution
);

auction.post("/product/:productId/bid", checkLoggedIn, auctionCtrl.bid);

//auction.get("/list", checkLoggedIn, auctionCtrl.renderList);

export default auction;
