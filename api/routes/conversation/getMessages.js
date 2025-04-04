const express = require("express");
const { Message } = require("../../models");
const authenticate = require("../../middleware/auth");

const router = express.Router();

// Get all messages for a specific conversation
router.get("/:conversationId/messages", authenticate, async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.findAll({
    where: {
      conversationId,
    },
    order: [["createdAt", "DESC"]], // Order messages by creation date
    attributes: ["id", "content", "type", "isRead", "senderId", "createdAt"], // Specify the fields to return
    limit: 15,
  });

  res.json(messages || []);
});

module.exports = router;
