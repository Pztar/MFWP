import passport from "koa-passport";
import { Strategy as KakaoStrategy } from "passport-kakao";

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID,
        callbackURL: "/api/auth/social/kakao/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("kakao profile", profile);
        return done(null, profile);
      }
    )
  );
};
