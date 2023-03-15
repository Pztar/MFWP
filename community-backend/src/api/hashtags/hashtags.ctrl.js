import mySQL from "../../../models";
import { Op } from "sequelize";

const { Hashtag } = mySQL;

export const list = async (ctx, next) => {
  //쿼리는 문자열이므로 숫자로 변환
  const page = parseInt(ctx.query.page || "1", 10);
  const hashtagPerPage = 10;
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  try {
    const { selected, searchWord, order = "createdAt", dateRange } = ctx.query;
    let hashtags = [];
    let hashtagCount = undefined;

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
    let orderOption = [
      [order, "DESC"],
      ["createdAt", "DESC"],
    ];

    const whereOption = selected
      ? {
          [Op.and]: [searchOption],
        }
      : {};

    const findhashtagsOption = {
      where: whereOption,
      limit: hashtagPerPage,
      offset: (page - 1) * hashtagPerPage,
      order: orderOption,
    };

    const { count, rows } = await Hashtag.findAndCountAll(findhashtagsOption);
    hashtags = rows;
    hashtagCount = count;

    ctx.set("Last-Page", Math.ceil(hashtagCount / hashtagPerPage));
    ctx.body = hashtags;
  } catch (err) {
    console.error(err);
    next(err);
  }
};
