import Router from "koa-router";
import checkLoggedIn from "../../lib/checkLoggedIn";
import * as roomCtrl from "./room.ctrl";

const room = new Router();

room.get("/", roomCtrl.listRooms);

room.post("/", roomCtrl.createRoom);

room.get("/:roomId", roomCtrl.enterRoom);

room.delete("/:roomId", roomCtrl.removeRoom);

room.post("/:roomId/chat", roomCtrl.sendChat);

export default room;
