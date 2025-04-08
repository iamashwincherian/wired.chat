const { Op, literal, fn, col } = require("sequelize");
const authenticate = require("../../middleware/auth");
const {
  Conversation,
  User,
  ConversationMember,
  Contact,
} = require("../../models");
const router = require("express").Router();

router.post("/", authenticate, async (req, res) => {
  const {
    user: { id: userId },
    body: { id },
  } = req;

  if (!id) {
    return res.status(400).json({ message: "Contact ID is required" });
  }

  const contact = await Contact.findOne({
    where: {
      id,
    },
    include: [
      {
        model: User,
        as: "user1",
        attributes: ["id", "name", "email", "avatar"],
        where: {
          id: {
            [Op.ne]: userId,
          },
        },
        required: false,
      },
      {
        model: User,
        as: "user2",
        attributes: ["id", "name", "email", "avatar"],
        where: {
          id: {
            [Op.ne]: userId,
          },
        },
        required: false,
      },
    ],
    attributes: {
      include: [
        [
          literal(
            `CASE WHEN "Contact"."user1Id" = :userId THEN to_json("user2") ELSE to_json("user1") END`
          ),
          "user",
        ],
      ],
      exclude: ["user1", "user2", "user1Id", "user2Id"],
    },
    replacements: { userId },
    raw: true,
  });

  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }

  let [conversation, created] = await Conversation.findOrCreate({
    where: {
      type: "direct",
    },
    include: [
      {
        model: User,
        where: {
          id: { [Op.ne]: userId, [Op.eq]: contact.user.id },
        },
        required: true,
      },
    ],
    defaults: {
      type: "direct",
    },
  });

  if (created) {
    await conversation.addMember(userId);
    await conversation.addMember(contact.user.id);
    conversation.dataValues.members = await conversation.getMembers();
  }
  conversation.dataValues.displayName =
    conversation.dataValues.members?.[0]?.user.name;
  conversation.dataValues.displayImage =
    conversation.dataValues.members?.[0]?.user.avatar;

  if (conversation.members?.length < 2) {
    return res.status(500).json({ message: "Conversation is corrupted" });
  }

  return res.json(conversation);
});

module.exports = router;
