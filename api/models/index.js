const User = require("./User");
const Group = require("./Group");
const Message = require("./Message");
const GroupMember = require("./GroupMember");
const Conversation = require("./Conversation");
const ConversationMember = require("./ConversationMember");
const ContactRequest = require("./ContactRequest");
const Contact = require("./Contact");
const sequelize = require("../config/database");

// User-Message associations (for direct messages)
User.hasMany(Message, { as: "SentMessages", foreignKey: "senderId" });
Message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "receiverId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });

// Group-Message associations
Group.hasMany(Message, { as: "GroupMessages", foreignKey: "groupId" });
Message.belongsTo(Group, { foreignKey: "groupId" });

// Group-User associations (through GroupMember)
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

Conversation.hasMany(Message, { foreignKey: "conversationId" });
Message.belongsTo(Conversation, { foreignKey: "conversationId" });

Conversation.hasMany(ConversationMember, {
  as: "members",
  foreignKey: "conversationId",
});

ConversationMember.belongsTo(Conversation, {
  as: "conversation",
  foreignKey: "conversationId",
  targetKey: "id",
});

ConversationMember.belongsTo(User, {
  as: "user",
  foreignKey: "userId",
  targetKey: "id",
});

User.belongsToMany(Conversation, {
  through: ConversationMember,
  foreignKey: "userId",
  otherKey: "conversationId",
});

Conversation.belongsToMany(User, {
  through: ConversationMember,
  foreignKey: "conversationId",
  otherKey: "userId",
});

// User associations
User.hasMany(ContactRequest, { foreignKey: "senderId", as: "sentRequests" });
User.hasMany(ContactRequest, {
  foreignKey: "receiverId",
  as: "receivedRequests",
});

Contact.belongsTo(User, {
  foreignKey: "user1Id",
  as: "user1",
});

Contact.belongsTo(User, {
  foreignKey: "user2Id",
  as: "user2",
});

// ContactRequest associations
ContactRequest.belongsTo(User, { as: "sender", foreignKey: "senderId" });
ContactRequest.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

module.exports = {
  sequelize,
  User,
  Group,
  Message,
  GroupMember,
  Conversation,
  ConversationMember,
  ContactRequest,
  Contact,
};
