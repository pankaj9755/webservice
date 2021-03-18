var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var promocode = connection.define(
  "promocode",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    title: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    minimum_amount: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    discount_type: {
      type: Sequelize.ENUM,
      values: ["percent", "amount"],
    },
    discount_amount: {
      type: Sequelize.STRING,
    },
    valid_from: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    valid_till: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    max_uses: {
      type: Sequelize.INTEGER,
    },
    max_uses_per_person: {
      type: Sequelize.INTEGER,
    },
    uses_count: {
      type: Sequelize.INTEGER,
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
    deleted_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "promocode",
    underscored: true,
  }
);

module.exports = promocode;
