var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var ratings = connection.define(
  "ratings",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    job_id: { type: Sequelize.INTEGER },
    customer_id: { type: Sequelize.INTEGER },
    therapist_id: { type: Sequelize.INTEGER },
    rating: { type: Sequelize.DOUBLE, allowNull: true, defaultValue: 0 },
    review: { type: Sequelize.TEXT, allowNull: true, defaultValue: null },
    type: {
      type: Sequelize.ENUM,
      values: ["customer", "therapist"],
      allowNull: true,
      defaultValue: "customer",
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
    tableName: "ratings",
    underscored: true,
  }
);

module.exports = ratings;
