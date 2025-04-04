const express = require("express");
const getAllConversations = require("./getAllConversations");
const getConversation = require("./getConversation");
const getMessages = require("./getMessages");
const startConversation = require("./startConversation");

const router = express.Router();

// Use the conversation routes
router.use("/", getAllConversations);
router.use("/", getConversation);
router.use("/", getMessages);
router.use("/", startConversation);

module.exports = router;
