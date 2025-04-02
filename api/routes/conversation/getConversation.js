const express = require("express");
const { Conversation, ConversationMember } = require("../../models");
const authenticate = require("../../middleware/auth");
const { Op } = require("sequelize");

const router = express.Router();

router.get("/:userId", authenticate, async (req, res) => {
  const {
    user: { id: userId },
  } = req;
  const { userId: otherUserId } = req.params;

  const conversation = await Conversation.findOne({
    where: {
      type: "direct",
    },
    include: [
      {
        model: ConversationMember,
        as: "members",
        where: {
          userId: {
            [Op.in]: [userId, otherUserId],
          },
        },
        attributes: ["userId"],
        required: true,
      },
    ],
    attributes: ["id", "type"],
  });

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  res.json(conversation);
});

module.exports = router;
