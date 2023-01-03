import Router from "koa-router";
import passport from "koa-passport";
import User from "../../../models/user";
import { generateToken } from ".";

const social = new Router();

social.get("/kakao", passport.authenticate("kakao"));
social.get("/kakao/callback", (ctx) => {
  return passport.authenticate(
    "facebook",
    { session: false },
    async (err, profile, info) => {
      // 계정 조회
      let account = await User.findOne({
        where: { snsId: profile.id, provider: "kakao" },
      });
      if (err) {
        return console.log(info);
      }
      // 계정이 없다면
      if (!account) {
        // 계정 생성
        account = await User.create({
          email: profile._json && profile._json.kakao_account_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: "kakao",
        });
      }

      // 토큰 생성
      const token = generateToken(account);

      ctx.cookies.set("access_token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });

      // 페이지 리다이렉트
      ctx.redirect("/");
    }
  )(ctx);
});

export default social;
