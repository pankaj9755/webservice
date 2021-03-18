var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var group_code = connection.define(
  "group_code",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    free_session: { type: Sequelize.INTEGER },
    status: { type: Sequelize.ENUM, values: ["active", "inactive"] },
    expiry_date: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
    permission: { type: Sequelize.BIGINT, allowNull: true, defaultValue: null },
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
    tableName: "group_code",
    underscored: true,
  }
);

module.exports = group_code;
