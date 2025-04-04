const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Conversation = sequelize.define(
  "Conversation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("direct", "group"),
      allowNull: false,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    // Only for group conversations
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Only for group conversations
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Conversation.prototype.addMember = async function (userId) {
  const { ConversationMember, User } = require("./index");
  console.log("checking existing ....", userId);
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const existingMember = await ConversationMember.findOne({
    where: {
      conversationId: this.id,
      userId,
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this conversation");
  }

  const newMember = await ConversationMember.create({
    userId,
    conversationId: this.id,
    role: "member",
  });

  return newMember;
};

Conversation.prototype.getMembers = async function (userId) {
  const { ConversationMember, User } = require("./index");

  const members = await ConversationMember.findAll({
    where: {
      conversationId: this.id,
    },
    include: {
      model: User,
      attributes: ["name", "avatar"],
      as: "user",
    },
  });

  return members;
};

module.exports = Conversation;
