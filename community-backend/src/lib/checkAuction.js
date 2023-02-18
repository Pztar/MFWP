import { scheduleJob } from "node-schedule";
import { Op } from "Sequelize";
import db from "../../models";

const setSolder = () => {};

export default async () => {
  console.log("checkAuction");
  try {
    const today = new Date();
    const targets = await db.Product.findAll({
      // 종료시간이 지난 낙찰자 없는 경매들
      where: {
        SoldId: null,
        terminatedAt: { [Op.lte]: today },
      },
    });
    targets.forEach(async (product) => {
      const t = await db.sequelize.transaction();
      try {
        const success = await db.Auction.findOne({
          where: { ProductId: product.id },
          order: [["bid", "DESC"]],
          transaction: t,
        });
        const bidder = await db.User.findOne({
          where: { id: success.UserId },
          transaction: t,
        });
        if (bidder.point >= success.bid) {
          await product.setSold(success.UserId, { transaction: t });
          await bidder.update({
            point: db.sequelize.literal(`point - ${success.bid}`),
            transaction: t,
          });
        } else {
          await success.destroy();
        }
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    });
    const ongoing = await db.Product.findAll({
      // 종료시간이 지나지 않은 낙찰자 없는 경매들
      where: {
        SoldId: null,
        terminatedAt: { [Op.gte]: today },
      },
    });
    ongoing.forEach((product) => {
      const end = new Date(product.terminatedAt); //경매 종료일

      const job = scheduleJob(end, async () => {
        const t = await db.sequelize.transaction();
        const success = await db.Auction.findOne({
          where: { ProductId: product.id },
          order: [["bid", "DESC"]],
        });
        const bidder = await db.User.findOne({
          where: { id: success.UserId },
          transaction: t,
        });
        if (bidder.point >= success.bid) {
          await product.setSold(success.UserId, { transaction: t });
          await bidder.update({
            point: db.sequelize.literal(`point - ${success.bid}`),
            transaction: t,
          });
        } else {
          await success.destroy();
        }
      });
      job.on("error", (err) => {
        console.error("스케줄링 에러", err);
      });
      job.on("success", () => {
        console.log("스케줄링 성공");
      });
    });
  } catch (error) {
    console.error(error);
  }
};
