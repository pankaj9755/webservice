var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var bank_info = connection.define(
  "bank_info",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    bank_id: { type: Sequelize.STRING },
    bank_name: { type: Sequelize.STRING },
    account_holder_name: { type: Sequelize.STRING },
    account_number: { type: Sequelize.STRING },
    ssn_number: { type: Sequelize.STRING },
    zipcode: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    id_proof: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    address_line_1: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    address_line_2: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    state: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    city: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    date_of_birth: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    routing_number: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    stripe_customer_id: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: Sequelize.ENUM,
      values: ["active", "inactive"],
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "bank_info",
    underscored: true,
  }
);
module.exports = bank_info;
