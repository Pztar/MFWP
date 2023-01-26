import Sequelize from "sequelize";

export default class Good extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(40),
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(40),
          allowNull: true,
        },
        img: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        explanation: {
          type: Sequelize.STRING(150),
          allowNull: true,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        TerminatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: true,
        modelName: "Good",
        tableName: "goods",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Good.belongsTo(db.User, { as: "Owner" });
    db.Good.belongsTo(db.User, { as: "Sold" });
    db.Good.hasMany(db.Auction);
  }
}
