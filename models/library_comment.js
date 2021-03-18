var connection = require("./../config/connection");
const Sequelize = require("sequelize");
var library_comment = connection.define(
  "library_comment",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: Sequelize.INTEGER },
    name: {
      type: Sequelize.STRING,
    },
    comment: {
      type: Sequelize.TEXT,
    },
    created_at: { type: Sequelize.DATE(6) },
  },
  {
    timestamps: false,
    freezeTableName: true,
    tableName: "library_comment",
    underscored: true,
  }
);

module.exports = library_comment;
