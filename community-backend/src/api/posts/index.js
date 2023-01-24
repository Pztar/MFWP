import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as postsCtrl from "./Posts.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", checkLoggedIn, postsCtrl.write);
posts.get("/:postId", postsCtrl.getPostById, postsCtrl.read);
posts.delete(
  "/:postId",
  postsCtrl.getPostById,
  checkLoggedIn,
  postsCtrl.checkOwnPost,
  postsCtrl.remove
);
posts.patch(
  "/:postId",
  postsCtrl.getPostById,
  checkLoggedIn,
  postsCtrl.checkOwnPost,
  postsCtrl.unassociateHashtag,
  postsCtrl.update
);

export default posts;
