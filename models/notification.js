var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var notifications = connection.define(
  "notifications",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    request_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    notification_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    type: {
      type: Sequelize.ENUM,
      values: [
        "detail",
        "customer_job_detail",
        "therapist_job_detail",
        "therapist_detail",
        "moods",
      ],
    },
    title: { type: Sequelize.STRING },
    message: { type: Sequelize.TEXT },
    status: {
      type: Sequelize.ENUM,
      values: ["draft", "pending", "cancel", "wip", "completed"],
    },
    created_at: { type: Sequelize.DATE(6) },
    deleted_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "notifications",
    underscored: true,
  }
);

module.exports = notifications;
