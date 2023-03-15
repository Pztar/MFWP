import Router from "koa-router";
import * as hashtagsCtrl from "./hashtags.ctrl";

const hashtags = new Router();

hashtags.get("/", hashtagsCtrl.list);

export default hashtags;
