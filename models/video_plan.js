var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var video_plan = connection.define(
  "video_plan",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: Sequelize.STRING },
    price: { type: Sequelize.DOUBLE },
    description: { type: Sequelize.STRING },
    number_of_minutes: { type: Sequelize.INTEGER },
    seconds: { type: Sequelize.STRING },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "inactive"],
    },
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
    tableName: "video_plan",
    underscored: true,
  }
);

module.exports = video_plan;
