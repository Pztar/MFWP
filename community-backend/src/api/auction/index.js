import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as auctionCtrl from "./auction.ctrl";

const action = new Router();
/*
action.get("/", auctionCtrl.list);
action.post("/", checkLoggedIn, auctionCtrl.regist);
action.get("/:productId", auctionCtrl.getProductById, auctionCtrl.read);
action.delete(
  "/:postId",
  auctionCtrl.getProductById,
  checkLoggedIn,
  auctionCtrl.checkOwnProduct,
  auctionCtrl.remove
);
action.patch(
  "/:postId",
  auctionCtrl.getProductById,
  checkLoggedIn,
  auctionCtrl.checkOwnProduct,
  auctionCtrl.update
);
*/
export default action;
