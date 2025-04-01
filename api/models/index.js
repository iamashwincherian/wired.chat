const User = require("./User");
const Group = require("./Group");
const Message = require("./Message");
const GroupMember = require("./GroupMember");
const sequelize = require("../config/database");

// User-Message associations (for direct messages)
User.hasMany(Message, { as: "SentMessages", foreignKey: "senderId" });
Message.belongsTo(User, { as: "Sender", foreignKey: "senderId" });
User.hasMany(Message, { as: "ReceivedMessages", foreignKey: "receiverId" });
Message.belongsTo(User, { as: "Receiver", foreignKey: "receiverId" });

// Group-Message associations
Group.hasMany(Message);
Message.belongsTo(Group);

// Group-User associations (through GroupMember)
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Group,
  Message,
  GroupMember,
};
