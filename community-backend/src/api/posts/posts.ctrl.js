import Joi from "joi";
import sanitizeHtml from "sanitize-html";
import { Op } from "sequelize";
import db from "../../../models";
import multer from "@koa/multer";
import path from "path";
import cors from "@koa/cors";

const { Post, User, Hashtag } = db;

//const { ObjectId } = mongoose.Types;

const sanitizeOption = {
  allowedTags: [
    "h1",
    "h2",
    "b",
    "i",
    "u",
    "s",
    "p",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "image",
  ],
  allowedAttributes: {
    a: ["href", "name", "target"],
    img: ["src"],
    image: ["src"],
    li: ["class"],
  },
  allowedSchemes: ["data", "http"],
};

export const getPostById = async (ctx, next) => {
  const { postId } = ctx.params;
  try {
    const post = await Post.findOne({
      where: { id: postId },
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
        },
        {
          model: Hashtag,
          attributes: ["title"],
        },
      ],
    });
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  console.log("확인", ctx.state);
  if (post.UserId !== user.id) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write = async (ctx, next) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  try {
    const post = await Post.create({
      title: sanitizeHtml(ctx.request.body.title, sanitizeOption),
      content: sanitizeHtml(ctx.request.body.content, sanitizeOption),
      UserId: ctx.state.user.id,
    });
    const hashtags = ctx.request.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

const removeHtmlAndShorten = (body) => {
  const filtered = sanitizeHtml(body, {
    allowedTags: [],
  });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};

export const list = async (ctx, next) => {
  //쿼리는 문자열이므로 숫자로 변환
  const page = parseInt(ctx.query.page || "1", 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    const { hashtag, userId } = ctx.query;
    console.log(ctx.query, ctx.query.userId);
    let posts = [];
    let postCount = undefined;
    if (hashtag) {
      const findedHashtag = await Hashtag.findOne({
        where: { title: hashtag },
      });
      if (findedHashtag) {
        posts = await findedHashtag.getPosts({
          include: [
            {
              model: User,
              attributes: ["id", "nick"],
            },
          ],
          limit: 10,
          offset: (page - 1) * 10,
          order: [["createdAt", "DESC"]],
        });
        postCount = await findedHashtag.countPosts();
      }
    } else if (userId) {
      const { count, rows } = await Post.findAndCountAll({
        where: { UserId: userId },
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
          },
        ],
        limit: 10,
        offset: (page - 1) * 10,
        order: [["createdAt", "DESC"]],
      });
      posts = rows;
      postCount = count;
    } else {
      const { count, rows } = await Post.findAndCountAll({
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
          },
        ],
        limit: 10,
        offset: (page - 1) * 10,
        order: [["createdAt", "DESC"]],
      });
      posts = rows;
      postCount = count;
    }
    ctx.set("Last-Page", Math.ceil(postCount / 10));
    ctx.body = posts;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const read = async (ctx) => {
  ctx.body = ctx.state.post;
};

export const remove = async (ctx) => {
  const { postId } = ctx.params;
  try {
    await Post.destroy({
      where: {
        id: postId,
      },
    });
    ctx.status = 204;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx) => {
  const { postId } = ctx.params;
  console.log("확인", postId);

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  const nextData = { ...ctx.request.body };

  if (nextData.title) {
    nextData.title = sanitizeHtml(nextData.title, sanitizeOption);
  }
  if (nextData.title) {
    nextData.content = sanitizeHtml(nextData.content, sanitizeOption);
  }
  try {
    await Post.update(
      { title: nextData.title },
      {
        where: {
          id: postId,
        },
      }
    );
    await Post.update(
      { content: nextData.content },
      {
        where: {
          id: postId,
        },
      }
    );

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      ctx.status = 404;
      return;
    }
    const hashtags = ctx.request.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

const fileFilter = (ctx, file, callback) => {
  const typeArray = file.mimetype.split("/");

  const fileType = typeArray[1]; // 이미지 확장자 추출

  //이미지 확장자 구분 검사
  if (fileType == "jpg" || fileType == "jpeg" || fileType == "png") {
    callback(null, true);
  } else {
    // return callback(new Error("*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다."), false)
    return callback(
      { message: "*.jpg, *.jpeg, *.png 파일만 업로드가 가능합니다." },
      false
    );
  }
};

export const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(ctx, file, cb) {
      cb(null, "public/uploads/");
    },
    // 저장할 이미지의 파일명
    filename(ctx, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "base64"
      );
      console.log("file.originalname", file.originalname);
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한
  fileFilter: fileFilter, // 이미지 업로드 필터링 설정
});

export const file = async (ctx, next) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  //console.log("전달받은 파일", ctx.file);
  //console.log("저장된 파일의 이름", ctx.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:4000/uploads/${ctx.file.filename}`;
  console.log(IMG_URL);
  ctx.body = { url: IMG_URL };
};
