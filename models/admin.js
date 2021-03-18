var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var admin = connection.define(
  "admin",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "inactive"],
      allowNull: true,
      defaultValue: "active",
    },
    image: { type: Sequelize.STRING },
    remember_token: { type: Sequelize.STRING },
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
    tableName: "admin",
    underscored: true,
  }
);

module.exports = admin;
