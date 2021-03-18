var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var setting = connection.define(
  "setting",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    commission: {
      type: Sequelize.STRING,
    },
    referral_discount: {
      type: Sequelize.STRING,
    },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "setting",
    underscored: true,
  }
);

module.exports = setting;
