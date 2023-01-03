import Router from "koa-router";
import * as authCtrl from "./auth.ctrl";
import social from "./social";
import jwt from "jsonwebtoken";
import jwtCookieConfig from "../../lib/jwtCookieConfig";

const auth = new Router();

auth.post("/register", authCtrl.register);
auth.post("/login", authCtrl.login);
auth.use("social", social.routes());
auth.get("/check", authCtrl.check);
auth.post("/logout", authCtrl.logout);

export const generateToken = (account) => {
  const token = jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    process.env.JWT_SECRET,
    jwtCookieConfig.jwt.options
  );
  return token;
};

export default auth;
