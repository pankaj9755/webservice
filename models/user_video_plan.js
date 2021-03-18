var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var user_video_plan = connection.define(
  "user_video_plan",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    invoice_id: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    user_id: { type: Sequelize.INTEGER },
    plan_id: { type: Sequelize.INTEGER },
    amount: { type: Sequelize.STRING },
    seconds: { type: Sequelize.STRING },
    used_seconds: { type: Sequelize.STRING, allowNull: true, defaultValue: 0 },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "inactive"],
    },
    payment_status: {
      type: Sequelize.ENUM,
      values: ["pending", "done", "failed"],
      allowNull: true,
      defaultValue: "pending",
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
    tableName: "user_video_plan",
    underscored: true,
  }
);

module.exports = user_video_plan;
