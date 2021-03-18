var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var users_temp = connection.define(
  "users_temp",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    first_name: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    last_name: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    kin_name: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    kin_number: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
    email: { type: Sequelize.STRING },
    mobile_number: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    social_key: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    social_type: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: ""
    },
    code: { type: Sequelize.STRING, allowNull: true, defaultValue: "" },
    count: { type: Sequelize.INTEGER },
    created_at: { type: Sequelize.DATE(6) },
    updated_at: {
      type: Sequelize.DATE(6),
      allowNull: true,
      defaultValue: null
    }
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "users_temp",
    underscored: true
  }
);

module.exports = users_temp;
