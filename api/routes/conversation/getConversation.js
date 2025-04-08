const express = require("express");
const { Conversation, User } = require("../../models");
const authenticate = require("../../middleware/auth");
const { Op, literal } = require("sequelize");

const router = express.Router();

router.get("/:conversationId", authenticate, async (req, res) => {
  const { conversationId } = req.params;
  const {
    user: { id: userId },
  } = req;

  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "email", "avatar"],
        where: {
          id: {
            [Op.ne]: userId,
          },
        },
        required: false,
      },
    ],
  });

  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  conversation.dataValues.displayName =
    conversation.dataValues.Users?.[0]?.name;
  conversation.dataValues.displayImage =
    conversation.dataValues.Users?.[0]?.avatar;

  res.json(conversation);
});

module.exports = router;
