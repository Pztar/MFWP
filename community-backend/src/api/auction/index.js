import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as auctionCtrl from "./auction.ctrl";

const auction = new Router();
/*
auction.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
*/
auction.get("/", auctionCtrl.listProducts);

auction.post("/product", checkLoggedIn, auctionCtrl.createProduct);

auction.get(
  "/product/:productId",
  checkLoggedIn,
  auctionCtrl.participateAuction
);

auction.post("/product/:productId/bid", checkLoggedIn, auctionCtrl.bid);

//auction.get("/list", checkLoggedIn, auctionCtrl.renderList);

auction.post(
  "/product/:productId/report",
  checkLoggedIn,
  auctionCtrl.reportProduct
);

export default auction;
