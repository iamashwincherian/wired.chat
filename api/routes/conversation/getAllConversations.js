const express = require("express");
const { Op, fn, col } = require("sequelize");

const { Conversation, ConversationMember, User } = require("../../models");
const authenticate = require("../../middleware/auth");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const {
    user: { id: userId },
  } = req;

  const conversations = await Conversation.findAll({
    where: {
      type: "direct",
    },
    include: {
      model: ConversationMember,
      as: "members",
      where: {
        userId: {
          [Op.ne]: userId,
        },
      },
      include: {
        model: User,
        as: "user",
        attributes: ["name", "avatar"],
      },
      attributes: ["userId"],
    },
    attributes: {
      include: [
        [
          fn("COALESCE", col("members.user.name"), col("Conversation.name")),
          "displayName",
        ],
      ],
    },
  });

  if (!conversations) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  res.json(conversations);
});

module.exports = router;
