import jwt from "jsonwebtoken";
import User from "../../models/user";
import { generateToken } from "../api/auth";
import jwtCookieConfig from "./jwtCookieConfig";
//C:\MFWP\community-backend\src\api\auth\index.js에서 jwt 토큰 생성
const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get("access_token");
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //console.log("토큰 해석", decoded);
    ctx.state.user = {
      id: decoded.id,
      nick: decoded.nick,
    };

    //console.log(ctx.state.user);

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 0.5) {
      const user = await User.findOne({ where: { nick: decoded.nick } });
      const token = generateToken(user);

      ctx.cookies.set("access_token", token, jwtCookieConfig.cookie);
    }
    //console.log(decoded);
    return next();
  } catch (e) {
    return next();
  }
};

export default jwtMiddleware;
