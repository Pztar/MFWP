import Joi from "joi";
import mySQL from "../../../models";
import sanitizeHtml from "sanitize-html";
import sanitizeOption from "./sanitizeOption";
import { Op } from "sequelize";

const { Post, User, Hashtag, Comment, Report } = mySQL;

//const { ObjectId } = mongoose.Types;

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
    const hashtags = ctx.request.body.content.match(/#[^\s#<]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await Promise.all(
        result.map((hashtag) => {
          hashtag[0].update(
            {
              tagedPostCount: mySQL.sequelize.literal(`tagedPostCount + 1`),
            }
            //{ silent: true } //updatedAt을 갱신하지 않고 업데이트//updatedAt이 해당 태그가 마지막으로 태그된 시점을 나타냄
          );
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
  const postPerPage = 10;
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    const {
      hashtag,
      userId,
      selected,
      searchWord,
      order = "createdAt",
      dateRange,
    } = ctx.query;
    let posts = [];
    let postCount = undefined;

    let searchStartDate = 0;
    switch (dateRange) {
      case "all":
        searchStartDate = 0;
        break;
      case "1day":
        searchStartDate = new Date(Date.now() - 86400000);
        break;
      case "3days":
        searchStartDate = new Date(Date.now() - 86400000 * 3);
        break;
      case "1week":
        searchStartDate = new Date(Date.now() - 86400000 * 7);
        break;
      case "1month":
        searchStartDate = new Date(Date.now() - 86400000 * 30);
        break;

      default:
        searchStartDate = 0;
        break;
    }

    let searchColumn = selected;
    let searchKeyword = searchWord;
    let searchOption = {
      [Op.and]: [
        { createdAt: { [Op.gte]: searchStartDate } },
        { [searchColumn]: { [Op.substring]: searchKeyword } },
      ],
    };
    if (selected === "title+content") {
      searchOption = {
        [Op.and]: [
          { createdAt: { [Op.gte]: searchStartDate } },
          {
            [Op.or]: [
              { title: { [Op.substring]: searchKeyword } },
              { content: { [Op.substring]: searchKeyword } },
            ],
          },
        ],
      };
    } else if (selected === "userNick") {
      const findedUsers = await User.findAll({
        where: { nick: { [Op.substring]: searchKeyword } },
      });
      if (findedUsers.length > 0) {
        searchOption = {
          UserId: { [Op.or]: findedUsers.map((user) => user.id) },
        };
      } else {
        ctx.set("Last-Page", Math.ceil(0 / postPerPage));
        ctx.body = [];
      }
    }
    let orderOption = [
      [order, "DESC"],
      ["createdAt", "DESC"],
    ];

    const includeOption = [
      {
        model: User,
        attributes: ["id", "nick"],
      },
      {
        model: Hashtag,
        attributes: ["title"],
      },
    ];

    if (hashtag) {
      const findedHashtag = await Hashtag.findOne({
        where: { title: hashtag },
      });
      if (findedHashtag) {
        posts = await findedHashtag.getPosts({
          where: selected ? searchOption : {},
          include: includeOption,
          limit: postPerPage,
          offset: (page - 1) * postPerPage,
          order: orderOption,
        });
        postCount = await findedHashtag.countPosts();
      }
    } else if (userId) {
      const { count, rows } = await Post.findAndCountAll({
        where: selected
          ? {
              [Op.and]: [searchOption, { UserId: userId }],
            }
          : { UserId: userId },
        include: includeOption,
        limit: postPerPage,
        offset: (page - 1) * postPerPage,
        order: orderOption,
      });
      posts = rows;
      postCount = count;
    } else {
      const { count, rows } = await Post.findAndCountAll({
        where: selected ? searchOption : {},
        include: includeOption,
        limit: postPerPage,
        offset: (page - 1) * postPerPage,
        order: orderOption,
      });
      posts = rows;
      postCount = count;
    }
    ctx.set("Last-Page", Math.ceil(postCount / postPerPage));
    ctx.body = posts;
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const read = async (ctx) => {
  const post = ctx.state.post; //getPostById에서 이미 포스트 조회함 Promise.all으로 최적화 할까 했지만...굳이...?
  try {
    const viewsCount = post.views;
    const [updatedPost, comments] = await Promise.all([
      post.update(
        {
          views: mySQL.sequelize.literal(`views + 1`),
        },
        { silent: true } //updatedAt을 갱신하지 않고 업데이트
      ),
      Comment.findAll({
        where: { postId: post.id },
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
          },
        ],
      }),
    ]);
    const shadowReverseComment = new Array();
    for (let i = comments.length; i > 0; i--) {
      comments[i - 1].dataValues.children = shadowReverseComment
        .filter((comment) => comments[i - 1].id === comment.parentId)
        .reverse();
      shadowReverseComment.push(comments[i - 1]);
    }
    const rootComments = comments.filter(
      (comment) => comment.parentId === null
    );
    updatedPost.views = viewsCount + 1; //재할당 하지 않으면 {val(pin):"views + 1"}으로 나옴
    const postAndComments = { post: updatedPost, comments: rootComments };
    ctx.body = postAndComments;
  } catch (e) {
    ctx.throw(500, e);
  }
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

export const unassociateHashtag = async (ctx, next) => {
  const { postId } = ctx.params;
  try {
    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      ctx.status = 404;
      return;
    }
    const hashtags = await post.getHashtags();
    await Promise.all(
      hashtags.map((hashtag) => {
        hashtag.update(
          {
            tagedPostCount: mySQL.sequelize.literal(`tagedPostCount - 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        );
      })
    );
    await post.setHashtags([]); // Un-associate all previously associated hashtags
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const update = async (ctx) => {
  const { postId } = ctx.params;

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
      { title: nextData.title, content: nextData.content },
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
    const hashtags = ctx.request.body.content.match(/#[^\s#<]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await Promise.all(
        result.map((hashtag) => {
          hashtag[0].update(
            {
              tagedPostCount: mySQL.sequelize.literal(`tagedPostCount + 1`),
            }
            //{ silent: true } //updatedAt을 갱신하지 않고 업데이트//updatedAt이 해당 태그가 마지막으로 태그된 시점을 나타냄
          );
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }

    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const likePost = async (ctx) => {
  const { postId } = ctx.params;
  try {
    const [post, user] = await Promise.all([
      Post.findOne({
        where: {
          id: postId,
        },
      }),
      User.findByPk(ctx.state.user.id),
    ]);

    if (await post.hasLikePostUser(user)) {
      await Promise.all([
        post.removeLikePostUser(user),
        post.update(
          {
            likes: mySQL.sequelize.literal(`likes - 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    } else {
      await Promise.all([
        post.addLikePostUser(user),
        post.update(
          {
            likes: mySQL.sequelize.literal(`likes + 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]).then(console.log);
    }
    const likePosts = await user.getLikePosts({ attributes: ["id"] });
    ctx.body = likePosts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const hatePost = async (ctx) => {
  const { postId } = ctx.params;
  try {
    const [post, user] = await Promise.all([
      Post.findOne({
        where: {
          id: postId,
        },
      }),
      User.findByPk(ctx.state.user.id),
    ]);

    if (await post.hasHatePostUser(user)) {
      await Promise.all([
        post.removeHatePostUser(user),
        post.update(
          {
            hates: mySQL.sequelize.literal(`hates - 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    } else {
      await Promise.all([
        post.addHatePostUser(user),
        post.update(
          {
            hates: mySQL.sequelize.literal(`hates + 1`),
          },
          { silent: true } //updatedAt을 갱신하지 않고 업데이트
        ),
      ]);
    }
    const hatePosts = await user.getHatePosts({ attributes: ["id"] });
    ctx.body = hatePosts;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const reportPost = async (ctx) => {
  const { postId } = ctx.params;
  try {
    const [post, report] = await Promise.all([
      Post.findByPk(postId),
      Report.findOne({
        where: {
          UserId: ctx.state.user.id, //신고한 사람
          reportedClass: "post",
          category: ctx.request.body.category,
          reportedClassId: postId,
        },
      }),
    ]);

    if (report) {
      await report.update({
        content: ctx.request.body.content,
      });
    } else {
      await Promise.all([
        Report.create({
          UserId: ctx.state.user.id, //신고한 사람
          reportedClass: "post",
          category: ctx.request.body.category,
          content: ctx.request.body.content,
          reportedClassId: postId,
          reportedUserId: post.UserId, //신고당한사람
        }),
        post.update(
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
