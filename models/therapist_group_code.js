var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var therapist_group_code = connection.define(
  "therapist_group_code",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    group_code_id: { type: Sequelize.INTEGER },
    therapist_id: { type: Sequelize.INTEGER },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "therapist_group_code",
    underscored: true,
  }
);

module.exports = therapist_group_code;
