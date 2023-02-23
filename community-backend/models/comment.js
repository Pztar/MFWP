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
        likes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        unlikes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        parentCommentId: {
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
    db.Comment.belongsTo(db.Post); /*
    db.Comment.belongsToMany(db.Comment, {
      foreignKey: "recommentingId", //대댓글 단 아이디를 통해서
      as: "recommented", //부모댓글을 찾는다
      through: "recomment",
    });
    db.Comment.belongsToMany(db.Comment, {
      foreignKey: "recommentedId", //대댓글 당한 아이디를 통해서
      as: "recommentings", //대댓글을 찾는다
      through: "recomment",
    });*/
  }
}
