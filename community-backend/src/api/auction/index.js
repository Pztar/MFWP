import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as auctionCtrl from "./auction.ctrl";

const action = new Router();
/*
action.get("/", auctionCtrl.list);
action.post("/", checkLoggedIn, auctionCtrl.regist);
action.get("/:goodId", auctionCtrl.getGoodById, auctionCtrl.read);
action.delete(
  "/:postId",
  auctionCtrl.getGoodById,
  checkLoggedIn,
  auctionCtrl.checkOwnGood,
  auctionCtrl.remove
);
action.patch(
  "/:postId",
  auctionCtrl.getGoodById,
  checkLoggedIn,
  auctionCtrl.checkOwnGood,
  auctionCtrl.update
);
*/
export default action;
