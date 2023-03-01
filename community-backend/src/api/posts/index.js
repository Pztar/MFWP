import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as postsCtrl from "./posts.ctrl";
import * as commentsCtrl from "./comments.ctrl";

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

posts.post("/:postId/comment", checkLoggedIn, commentsCtrl.write);
posts.get("/:postId/likePost", checkLoggedIn, commentsCtrl.write);
posts.get("/:postId/hatePost", checkLoggedIn, commentsCtrl.write);

export default posts;
