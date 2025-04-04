const { Message } = require("../models");

const createMessage = ({ message, roomId, userId, receiverId }) => {
  return Message.create({
    content: message,
    senderId: userId,
    conversationId: roomId,
    receiverId,
  });
};

const MessageService = { createMessage };
module.exports = MessageService;
