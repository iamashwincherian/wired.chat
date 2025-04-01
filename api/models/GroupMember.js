const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const GroupMember = sequelize.define(
  "GroupMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      defaultValue: "member",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = GroupMember;
