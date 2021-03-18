var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var user_notification_keys = connection.define(
  "user_notification_keys",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    user_type: { type: Sequelize.ENUM, values: ["customer", "therapist"] },
    user_type: { type: Sequelize.ENUM, values: ["android", "iOS", "web"] },
    device_key: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    notification_key: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    },
    created_at: { type: Sequelize.DATE(6) }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "user_notification_keys",
    underscored: true
  }
);

module.exports = user_notification_keys;
