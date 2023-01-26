import { Op } from "sequelize";
import db from "../../../models";
import { scheduleJob } from "node-schedule";

export const listGoods = async (ctx, next) => {
  const page = parseInt(ctx.query.page || "1", 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    const now = new Date();
    const { count, rows } = await db.Good.findAndCountAll({
      where: { SoldId: null, TerminatedAt: { [Op.gte]: now } },
      limit: 20,
      offset: (page - 1) * 20,
      order: [["createdAt", "DESC"]],
    });
    const goods = rows;
    const goodsCount = count;
    ctx.set("Last-Page", Math.ceil(goodsCount / 20));
    ctx.body = goods;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createGood = async (ctx, next) => {
  try {
    const { name, category, explanation, price, TerminatedAt } =
      ctx.request.body;
    const good = await db.Good.create({
      OwnerId: ctx.state.user.id,
      name,
      category,
      img: ctx.file.filename,
      explanation,
      price,
      TerminatedAt,
    });
    const job = scheduleJob(TerminatedAt, async () => {
      const success = await db.Auction.findOne({
        where: { GoodId: good.id },
        order: [["bid", "DESC"]],
      });
      await good.setSold(success.UserId);
      await db.User.update(
        {
          point: db.sequelize.literal(`point - ${success.bid}`),
        },
        {
          where: { id: success.UserId },
        }
      );
    });
    job.on("error", (err) => {
      console.error("스케줄링 에러", err);
    });
    job.on("success", () => {
      console.log("스케줄링 성공");
    });
    ctx.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const renderAuction = async (ctx, next) => {
  try {
    const [good, auction] = await Promise.all([
      db.Good.findOne({
        where: { id: ctx.params.goodId },
        include: {
          model: db.User,
          as: "Owner",
        },
      }),
      db.Auction.findAll({
        where: { GoodId: ctx.params.goodId },
        include: { model: db.User },
        order: [["bid", "ASC"]],
      }),
    ]);
    ctx.body = [good, auction];
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const bid = async (ctx, next) => {
  try {
    const { bid, msg } = ctx.request.body;
    const good = await db.Good.findOne({
      where: { id: ctx.params.id },
      include: { model: db.Auction },
      order: [[{ model: db.Auction }, "bid", "DESC"]],
    });
    if (!good) {
      return ctx.status(404).send("해당 상품은 존재하지 않습니다.");
    }
    if (good.price >= bid) {
      return ctx.status(403).send("시작 가격보다 높게 입찰해야 합니다.");
    }
    if (new Date(good.createdAt).valueOf() + 24 * 60 * 60 * 1000 < new Date()) {
      return ctx.status(403).send("경매가 이미 종료되었습니다");
    }
    if (good.Auctions[0].bid * 1.05 > bid) {
      return ctx.status(403).send("이전 입찰가보다 5% 이상 높아야 합니다");
    }
    const result = await db.Auction.create({
      bid,
      msg,
      UserId: ctx.state.user.id,
      GoodId: ctx.params.id,
    });
    // 실시간으로 입찰 내역 전송
    ctx.io.to(ctx.params.id).emit("bid", {
      bid: result.bid,
      msg: result.msg,
      nick: ctx.state.user.nick,
    });
    return ctx.send("ok");
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
