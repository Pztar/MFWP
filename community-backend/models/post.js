import Sequelize from "sequelize";

export default class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(5000),
          allowNull: false,
        },
        views: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        commentCounts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
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
          type: Sequelize.SMALLINT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: true,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Comment);
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" });

    db.Post.belongsToMany(db.User, { as: "LikeUser", through: "LikePost" });
    db.Post.belongsToMany(db.User, { as: "HateUser", through: "HatePost" });
  }
}
