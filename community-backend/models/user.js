import Sequelize from "sequelize";

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        experience: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        point: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);

    db.User.hasMany(db.Auction);
    db.User.hasMany(db.Report);

    db.User.belongsToMany(db.User, {
      foreignKey: "followingId",
      as: "Followers",
      through: "Follow",
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });

    db.User.belongsToMany(db.Post, {
      as: "LikePosts",
      through: "UserLikePost",
    });
    db.User.belongsToMany(db.Post, {
      as: "HatePosts",
      through: "UserHatePost",
    });

    db.User.belongsToMany(db.Comment, {
      as: "LikeComments",
      through: "UserLikeComment",
    });
    db.User.belongsToMany(db.Comment, {
      as: "HateComments",
      through: "UserHateComment",
    });
  }
}
