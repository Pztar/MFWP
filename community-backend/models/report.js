import Sequelize from "sequelize";

export default class Report extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        class: {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        reportedClassId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Report",
        tableName: "reports",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.Post.belongsTo(db.User);
  }
}
