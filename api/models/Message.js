const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("text", "image", "file"),
      defaultValue: "text",
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // null if it's a group message
    receiverId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    // null if it's a direct message
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Message;
