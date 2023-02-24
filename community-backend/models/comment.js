import Sequelize from "sequelize";

export default class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        ordinalNumber: {
          type: Sequelize.SMALLINT,
          allowNull: false,
          defaultValue: -1,
        },
        content: {
          type: Sequelize.STRING(1000),
          allowNull: false,
        },
        parentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Comment",
        tableName: "comments",
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
    db.Post.belongsToMany(db.User, { through: "LikeComment" });
    db.Post.belongsToMany(db.User, { through: "HateComment" });
  }
}
