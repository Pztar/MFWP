import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as roomCtrl from "./room.ctrl";

const room = new Router();

room.get("/", roomCtrl.listRooms);

room.post("/", roomCtrl.createRoom);

room.get("/:id", roomCtrl.enterRoom);

room.delete("/:id", roomCtrl.removeRoom);

room.post("/:id/chat", roomCtrl.sendChat);

export default room;
