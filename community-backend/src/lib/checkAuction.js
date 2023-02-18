import { scheduleJob } from "node-schedule";
import { Op } from "Sequelize";
import db from "../../models";

export const setSoldId = async (product) => {
  try {
    const success = await db.Auction.findOne({
      where: { ProductId: product.id },
      order: [["bid", "DESC"]],
    });
    if (success) {
      const bidder = await db.User.findOne({
        where: { id: success.UserId },
      });
      if (bidder.point >= success.bid) {
        await product.setSold(success.UserId);
        await bidder.update({
          point: db.sequelize.literal(`point - ${success.bid}`),
        });
      } else {
        await success.destroy();
        setSoldId(product);
      }
    } else {
      //아무도 입찰하지 않은 상품 처리
      await product.destroy();
    }
  } catch (error) {
    console.log("checkAuction 에러 발생");
  }
};

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
      setSoldId(product);
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
        setSoldId(product);
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
