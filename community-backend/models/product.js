import Sequelize from "sequelize";

export default class Product extends Sequelize.Model {
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
        modelName: "Product",
        tableName: "products",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Product.belongsTo(db.User, { as: "Owner" });
    db.Product.belongsTo(db.User, { as: "Sold" });
    db.Product.hasMany(db.Auction);
  }
}
