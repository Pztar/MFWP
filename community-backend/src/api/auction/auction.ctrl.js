import { Op } from "sequelize";
import db from "../models";
import { scheduleJob } from "node-schedule";

export const renderMain = async (ctx, next) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
    const goods = await db.Good.findAll({
      where: { SoldId: null, createdAt: { [Op.gte]: yesterday } },
    });
    ctx.body = goods;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createGood = async (ctx, next) => {
  try {
    const { name, price } = ctx.request.body;
    const good = await db.Good.create({
      OwnerId: ctx.state.user.id,
      name,
      img: ctx.file.filename,
      price,
    });
    const end = new Date();
    end.setDate(end.getDate() + 1); // 하루 뒤
    const job = scheduleJob(end, async () => {
      const success = await db.Auction.findOne({
        where: { GoodId: good.id },
        order: [["bid", "DESC"]],
      });
      await good.setSold(success.UserId);
      await db.User.update(
        {
          money: db.sequelize.literal(`money - ${success.bid}`),
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
        where: { id: ctx.params.id },
        include: {
          model: db.User,
          as: "Owner",
        },
      }),
      db.Auction.findAll({
        where: { GoodId: ctx.params.id },
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
