import { Op } from "sequelize";
import db from "../../../models";
import { scheduleJob } from "node-schedule";
import { setSoldId } from "../../lib/checkAuction";

export const listProducts = async (ctx, next) => {
  const page = parseInt(ctx.query.page || "1", 10);
  const { category, userId } = ctx.query;

  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    let products = null;
    let productsCount = null;
    if (userId) {
      if (userId == 0) {
        const { count, rows } = await db.Product.findAndCountAll({
          where: { SoldId: { [Op.gte]: 0 } },
          include: [
            {
              model: db.User,
              attributes: ["id", "nick"],
              as: "Owner",
            },
            {
              model: db.User,
              attributes: ["id", "nick"],
              as: "Sold",
            },
          ],
          limit: 20,
          offset: (page - 1) * 20,
          order: [["createdAt", "DESC"]],
        });
        products = rows;
        productsCount = count;
      } else {
        const { count, rows } = await db.Product.findAndCountAll({
          where: { SoldId: userId },
          include: [
            {
              model: db.User,
              attributes: ["id", "nick"],
              as: "Owner",
            },
            {
              model: db.User,
              attributes: ["id", "nick"],
              as: "Sold",
            },
          ],
          limit: 20,
          offset: (page - 1) * 20,
          order: [["createdAt", "DESC"]],
        });
        products = rows;
        productsCount = count;
      }
    } else {
      const now = new Date();
      const { count, rows } = await db.Product.findAndCountAll({
        where: { SoldId: null, terminatedAt: { [Op.gte]: now } },
        include: {
          model: db.User,
          attributes: ["id", "nick"],
          as: "Owner",
        },
        limit: 20,
        offset: (page - 1) * 20,
        order: [["createdAt", "DESC"]],
      });
      products = rows;
      productsCount = count;
    }
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
    const now = new Date();

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
      setSoldId(product);
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

export const participateAuction = async (ctx, next) => {
  try {
    const product = await db.Product.findOne({
      where: { id: ctx.params.productId },
      include: {
        model: db.User,
        attributes: ["id", "nick"],
        as: "Owner",
      },
    });
    const auctions = await db.Auction.findAll({
      where: { ProductId: ctx.params.productId },
      include: { model: db.User, attributes: ["id", "nick"] },
      order: [["bid", "ASC"]],
    });
    const { point } = await db.User.findOne({
      where: { id: ctx.state.user.id },
    });

    const productAuction = { product, auctions, point };
    ctx.body = productAuction;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const bid = async (ctx, next) => {
  try {
    const { bid, msg } = ctx.request.body;
    const productId = ctx.params.productId;
    const product = await db.Product.findOne({
      where: { id: productId },
      include: { model: db.Auction },
      order: [[{ model: db.Auction }, "bid", "DESC"]],
    });
    const user = await db.User.findOne({
      where: { id: ctx.state.user.id },
    });
    if (!product) {
      return (ctx.body = "해당 상품은 존재하지 않습니다.");
    }
    if (product.OwnerId === ctx.state.user.id) {
      return (ctx.body = "판매자는 입찰할 수 없습니다");
    }
    if (user.point < bid) {
      return (ctx.body = "포인트가 부족합니다.");
    }
    if (product.price > bid) {
      return (ctx.body = "시작 가격 이상 입찰해야 합니다.");
    }
    if (new Date(product.terminatedAt).valueOf() < new Date().valueOf()) {
      return (ctx.body = "경매가 이미 종료되었습니다");
    }
    if (product.Auctions.length > 0) {
      if (product.Auctions[0].bid * 1.01 >= bid) {
        return (ctx.body = "이전 입찰가보다 1% 이상 높아야 합니다");
      }
    }
    const result = await db.Auction.create({
      bid,
      msg,
      UserId: ctx.state.user.id,
      ProductId: productId,
    });
    // 실시간으로 입찰 내역 전송
    ctx.io
      .of("/auction")
      .to(productId)
      .emit("bid", {
        id: result.id,
        bid: result.bid,
        msg: result.msg,
        createdAt: result.createdAt,
        User: { id: ctx.state.user.id, nick: ctx.state.user.nick },
      });
    ctx.body = null;
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const reportProduct = async (ctx) => {
  const { productId } = ctx.params;
  try {
    const [product, report] = await Promise.all([
      db.Product.findByPk(productId),
      db.Report.findOne({
        where: {
          UserId: ctx.state.user.id, //신고한 사람
          reportedClass: "product",
          category: ctx.request.body.category,
          reportedClassId: productId,
        },
      }),
    ]);

    if (report) {
      await report.update({
        content: ctx.request.body.content,
      });
    } else {
      await Promise.all([
        db.Report.create({
          UserId: ctx.state.user.id, //신고한 사람
          reportedClass: "product",
          category: ctx.request.body.category,
          content: ctx.request.body.content,
          reportedClassId: productId,
          reportedUserId: product.UserId, //신고당한사람
        }),
        product.update(
          {
            reports: db.sequelize.literal(`reports + 1`),
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
