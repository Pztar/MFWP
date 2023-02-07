import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as chatCtrl from "./Chat.ctrl";

const chat = new Router();

export default chat;
