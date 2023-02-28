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

        likes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        hates: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        reports: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
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

    db.Comment.belongsToMany(db.User, {
      as: "LikeUser",
      through: "LikeComment",
    });
    db.Comment.belongsToMany(db.User, {
      as: "HateUser",
      through: "HateComment",
    });
  }
}
