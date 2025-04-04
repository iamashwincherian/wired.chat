const { Op, literal, fn, col } = require("sequelize");
const authenticate = require("../../middleware/auth");
const { Conversation, User, ConversationMember } = require("../../models");
const router = require("express").Router();

router.post("/", authenticate, async (req, res) => {
  const {
    user: { id: userId },
    body: { email },
  } = req;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const existingUser = await User.findOne({
    where: { email, id: { [Op.ne]: userId } },
  });

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  let [conversation, created] = await Conversation.findOrCreate({
    where: {
      type: "direct",
    },
    defaults: {
      type: "direct",
    },
  });

  if (created) {
    await conversation.addMember(userId);
    await conversation.addMember(existingUser.id);
    conversation.dataValues.members = await conversation.getMembers();
  }
  conversation.dataValues.displayName =
    conversation.dataValues.members?.[0]?.user.name;

  if (conversation.members?.length < 2) {
    return res.status(500).json();
  }

  return res.json(conversation);
});

module.exports = router;
