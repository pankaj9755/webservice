var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var pages = connection.define(
  "pages",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    message: {
      type: Sequelize.TEXT,
    },
    type: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "inactive"],
      allowNull: true,
      defaultValue: "active",
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
    tableName: "pages",
    underscored: true,
  }
);

module.exports = pages;
