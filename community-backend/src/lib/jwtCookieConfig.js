export default {
  jwt: {
    secret: process.env.JWT_SECRET || "SetStrongSecretInDotEnv",
    options: {
      //audience: "https://example.io",
      expiresIn: "1d", // 12h
      //issuer: "example.io",
    },
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, //1일
      httpOnly: true,
      sameSite: true,
      signed: true,
      secure: false,
    },
  },
};
