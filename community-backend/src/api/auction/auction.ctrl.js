import { Op } from "sequelize";
import db from "../../../models";
import { scheduleJob } from "node-schedule";

export const listProducts = async (ctx, next) => {
  const page = parseInt(ctx.query.page || "1", 10);
  const category = ctx.query.category;
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    const now = new Date();
    const { count, rows } = await db.Product.findAndCountAll({
      where: { SoldId: null, terminatedAt: { [Op.gte]: now } },
      include: {
        model: db.User,
        as: "Owner",
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: [["createdAt", "DESC"]],
    });
    const products = rows;
    const productsCount = count;
    ctx.set("Last-Page", Math.ceil(productsCount / 20));
    ctx.body = products;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createProduct = async (ctx, next) => {
  try {
    const { name, category, img, explanation, price, terminatedAt } =
      ctx.request.body;
    const product = await db.Product.create({
      OwnerId: ctx.state.user.id,
      name,
      category,
      img,
      explanation,
      price,
      terminatedAt,
    });
    const job = scheduleJob(terminatedAt, async () => {
      const success = await db.Auction.findOne({
        where: { ProductId: product.id },
        order: [["bid", "DESC"]],
      });
      await product.setSold(success.UserId);
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
    ctx.body = product;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const participateAcution = async (ctx, next) => {
  try {
    const { product, auction } = await Promise.all([
      db.Product.findOne({
        where: { id: ctx.params.productId },
        include: {
          model: db.User,
          as: "Owner",
        },
      }),
      db.Auction.findAll({
        where: { ProductId: ctx.params.productId },
        include: { model: db.User },
        order: [["bid", "ASC"]],
      }),
    ]);
    const productAction = { product, auction };
    ctx.body = productAction;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const bid = async (ctx, next) => {
  try {
    const { bid, msg } = ctx.request.body;
    const product = await db.Product.findOne({
      where: { id: ctx.params.productId },
      include: { model: db.Auction },
      order: [[{ model: db.Auction }, "bid", "DESC"]],
    });
    if (!product) {
      return ctx.status(404).send("해당 상품은 존재하지 않습니다.");
    }
    if (product.price >= bid) {
      return ctx.status(403).send("시작 가격보다 높게 입찰해야 합니다.");
    }
    if (
      new Date(product.terminatedAt).valueOf() + 24 * 60 * 60 * 1000 <
      new Date()
    ) {
      return ctx.status(403).send("경매가 이미 종료되었습니다");
    }
    if (product.Auctions[0].bid * 1.05 > bid) {
      return ctx.status(403).send("이전 입찰가보다 5% 이상 높아야 합니다");
    }
    const result = await db.Auction.create({
      bid,
      msg,
      UserId: ctx.state.user.id,
      ProductId: ctx.params.productId,
    });
    // 실시간으로 입찰 내역 전송
    ctx.io.to(ctx.params.productId).emit("bid", {
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
