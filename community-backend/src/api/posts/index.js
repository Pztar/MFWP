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

posts.get("/:postId/likePost", checkLoggedIn, postsCtrl.likePost);
posts.get("/:postId/hatePost", checkLoggedIn, postsCtrl.hatePost);
posts.post("/:postId/report", checkLoggedIn, postsCtrl.reportPost);

posts.post("/:postId/comment", checkLoggedIn, commentsCtrl.write);

posts.get(
  "/comment/:commentId/likeComment",
  checkLoggedIn,
  commentsCtrl.likeComment
);
posts.get(
  "/comment/:commentId/hateComment",
  checkLoggedIn,
  commentsCtrl.hateComment
);
posts.post(
  "/comment/:commentId/report",
  checkLoggedIn,
  commentsCtrl.reportComment
);

export default posts;
