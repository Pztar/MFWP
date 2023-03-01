import Joi from "joi";
import mySQL from "../../../models";
import sanitizeHtml from "sanitize-html";
import sanitizeOption from "./sanitizeOption";

const { Post, Comment, User, Report } = mySQL;

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
    ordinalNumber: Joi.allow(null),
    content: Joi.string().required(),
    parentId: Joi.allow(null),
  });

  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  let ordinalNumber = -1;
  if (ctx.request.body.ordinalNumber) {
    ordinalNumber = ctx.request.body.ordinalNumber;
  }

  try {
    const [comment, post] = await Promise.all([
      Comment.create({
        ordinalNumber: ordinalNumber,
        content: sanitizeHtml(ctx.request.body.content, sanitizeOption),
        parentId: ctx.request.body.parentId,
        UserId: ctx.state.user.id,
        PostId: ctx.params.postId,
      }),
      Post.findOne({
        where: { id: ctx.params.postId },
      }),
    ]);

    if (!post) {
      ctx.status = 404;
      return;
    } else {
      await post.update(
        {
          commentCounts: mySQL.sequelize.literal(`commentCounts + 1`),
        },
        { silent: true } //updatedAt을 갱신하지 않고 업데이트
      );
    }
    ctx.body = comment;
  } catch (error) {
    ctx.throw(500, error);
  }
};

export const likeComment = async (ctx) => {
  const { commentId } = ctx.params;
  try {
    const [comment, user] = await Promise.all([
      Comment.findOne({
        where: {
          id: commentId,
        },
      }),
      User.findByPk(ctx.state.user.id),
    ]);

    if (await comment.hasLikeCommentUser(user)) {
      await Promise.all([
        comment.removeLikeCommentUser(user),
        comment.update(
          {
            likes: mySQL.sequelize.literal(`likes - 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    } else {
      await Promise.all([
        comment.addLikeCommentUser(user),
        comment.update(
          {
            likes: mySQL.sequelize.literal(`likes + 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    }
    const likeComments = await user.getLikeComments({ attributes: ["id"] });
    ctx.body = likeComments;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const hateComment = async (ctx) => {
  const { commentId } = ctx.params;
  try {
    const [comment, user] = await Promise.all([
      Comment.findOne({
        where: {
          id: commentId,
        },
      }),
      User.findByPk(ctx.state.user.id),
    ]);

    if (await comment.hasHateCommentUser(user)) {
      await Promise.all([
        comment.removeHateCommentUser(user),
        comment.update(
          {
            hates: mySQL.sequelize.literal(`hates - 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    } else {
      await Promise.all([
        comment.addHateCommentUser(user),
        comment.update(
          {
            hates: mySQL.sequelize.literal(`hates + 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    }
    const hateComments = await user.getHateComments({ attributes: ["id"] });
    ctx.body = hateComments;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const reportComment = async (ctx) => {
  const { commentId } = ctx.params;
  try {
    const [comment, report] = await Promise.all([
      Comment.findByPk(commentId),
      Report.findOne({
        where: {
          UserId: ctx.state.user.id, //신고한 사람
          class: "comment",
          reportedClassId: commentId,
        },
      }),
    ]);

    if (report) {
      await report.update({
        category: ctx.request.body.category,
        content: ctx.request.body.content,
      });
    } else {
      await Promise.all([
        Report.create({
          UserId: ctx.state.user.id, //신고한 사람
          class: "comment",
          category: ctx.request.body.category,
          content: ctx.request.body.content,
          reportedClassId: commentId,
          reportedUserId: comment.UserId, //신고당한사람
        }),
        comment.update(
          {
            reports: mySQL.sequelize.literal(`reports + 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    }
    ctx.status = 204;
  } catch (error) {
    ctx.throw(500, error);
  }
};
