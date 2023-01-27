import { scheduleJob } from "node-schedule";
import { Op } from "Sequelize";
import db from "../../models";

export default async () => {
  console.log("checkAuction");
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1); // 어제 시간
    const targets = await db.Product.findAll({
      // 24시간이 지난 낙찰자 없는 경매들
      where: {
        SoldId: null,
        createdAt: { [Op.lte]: yesterday },
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
        await product.setSold(success.UserId, { transaction: t });
        await db.User.update(
          {
            point: db.sequelize.literal(`point - ${success.bid}`),
          },
          {
            where: { id: success.UserId },
            transaction: t,
          }
        );
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    });
    const ongoing = await db.Product.findAll({
      // 24시간이 지나지 않은 낙찰자 없는 경매들
      where: {
        SoldId: null,
        createdAt: { [Op.gte]: yesterday },
      },
    });
    ongoing.forEach((product) => {
      const end = new Date(product.createdAt);
      end.setDate(end.getDate() + 1); // 생성일 24시간 뒤가 낙찰 시간
      const job = scheduleJob(end, async () => {
        const t = await db.sequelize.transaction();
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
    });
  } catch (error) {
    console.error(error);
  }
};
