var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var moods = connection.define(
  "moods",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: { type: Sequelize.ENUM, values: ["active", "inactive"] },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
    deleted_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "moods",
    underscored: true,
  }
);

module.exports = moods;
