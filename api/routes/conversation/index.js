const express = require("express");
const getAllConversationsRoutes = require("./getAllConversations");
const getConversationRoutes = require("./getConversation");

const router = express.Router();

// Use the conversation routes
router.use("/", getAllConversationsRoutes);
router.use("/", getConversationRoutes);

module.exports = router;
