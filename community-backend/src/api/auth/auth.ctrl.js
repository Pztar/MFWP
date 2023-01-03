import User from "../../../models/user";
import bcrypt from "bcrypt";
import { generateToken } from ".";
import Joi from "joi";
import jwtCookieConfig from "../../lib/jwtCookieConfig";

export const register = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().required(),
    nick: Joi.string().max(15).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const { email, nick, password } = ctx.request.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return (ctx.status = 409);
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    const registUser = await User.findOne({ where: { email } });
    const user = { id: registUser.id, email: registUser.email };
    ctx.body = user;

    const token = generateToken(registUser);
    ctx.cookies.set("access_token", token, jwtCookieConfig.cookie);
  } catch (error) {
    ctx.throw(error);
  }
};

export const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  console.log(email, password);
  if (!email || !password) {
    ctx.status = 401;
    return;
  }
  try {
    const exUser = await User.findOne({ where: { email } });
    if (!exUser) {
      ctx.status = 401;
      return;
    }
    const valid = await bcrypt.compare(password, exUser.password);
    if (!valid) {
      ctx.status = 401;
      return;
    }
    const user = { id: exUser.id, email: exUser.email };
    ctx.body = user;

    const token = generateToken(exUser);
    ctx.cookies.set("access_token", token, jwtCookieConfig.cookie);
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};

export const logout = async (ctx) => {
  ctx.cookies.set("access_token");
  ctx.status = 204;
};

/*
router.get("/kakao", passport.authenticate("kakao"));

router.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/");
  }
);
*/
