const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ConversationMember = sequelize.define(
  "ConversationMember",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    conversationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Conversations",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM("admin", "member"),
      defaultValue: "member",
    },
    lastReadAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = ConversationMember;
