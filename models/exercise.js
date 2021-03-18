var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var exercises = connection.define(
  "exercises",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    file: {
      type: Sequelize.STRING,
    },
    type: { type: Sequelize.ENUM, values: ["image", "video"] },
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
    tableName: "exercises",
    underscored: true,
  }
);

module.exports = exercises;
