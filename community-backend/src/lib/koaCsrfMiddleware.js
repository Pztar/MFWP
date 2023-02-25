import CSRF from "koa-csrf";

export const csrfOption = new CSRF({
  invalidSessionSecretMessage: "Invalid session secret",
  invalidSessionSecretStatusCode: 403,
  invalidTokenMessage: "Invalid CSRF token",
  invalidTokenStatusCode: 403,
  excludedMethods: ["GET", "HEAD", "OPTIONS"],
});
export const setCsrfTokenInCookie = async (ctx, next) => {
  const csrfToken = ctx.csrf;
  // CSRF 토큰을 쿠키에 저장
  ctx.cookies.set("csrfToken", csrfToken, { httpOnly: false });
  await next();
};
export const assertCSRF = async (ctx, next) => {
  // CSRF 토큰을 검증합니다.
  const csrfTokenCookie = ctx.cookies.get("csrfToken");
  const csrfTokenHeader = ctx.request.header["x-csrf-token"];
  if (csrfTokenCookie !== csrfTokenHeader) {
    ctx.throw(403, "Invalid CSRF token");
  }
  // 요청을 처리합니다.
  // ...
  await next();
};
