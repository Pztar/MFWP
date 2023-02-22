import Joi from "joi";
import mySQL from "../../../models";
import sanitizeHtml from "sanitize-html";
import sanitizeOption from "./sanitizeOption";

const { Post, Comment } = mySQL;

export const getCommentById = async (ctx, next) => {
  const { commentId } = ctx.params;
  try {
    const comment = await Comment.findOne({
      where: { id: commentId },
      include: [
        {
          model: mySQL.User,
          attributes: ["id", "nick"],
        },
      ],
    });
    if (!comment) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = comment;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const checkOwnComment = (ctx, next) => {
  const { user, comment } = ctx.state;
  if (comment.UserId !== user.id) {
    ctx.status = 403;
    return;
  }
  return next();
};

export const write = async (ctx, next) => {
  const schema = Joi.object().keys({
    ordinalNumber: Joi.string(),
    content: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const comment = await Comment.create({
      ordinalNumber: parseInt(ctx.request.body.ordinalNumber, 10),
      content: sanitizeHtml(ctx.request.body.content, sanitizeOption),
      UserId: ctx.state.user.id,
      PostId: ctx.params.postId,
    });
    ctx.body = comment;
  } catch (error) {
    ctx.throw(500, error);
  }
};
