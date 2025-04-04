const express = require("express");
const { ContactRequest, User } = require("../../models");
const authenticate = require("../../middleware/auth");

const router = express.Router();

router.post("/request", authenticate, async (req, res) => {
  const { id } = req.body;
  const senderId = req.user.id;

  const receiver = await User.findByPk(id);
  if (!receiver) {
    return res.status(404).json({ message: "User not found" });
  }

  const existingRequest = await ContactRequest.findOne({
    where: {
      senderId,
      receiverId: receiver.id,
    },
  });

  if (existingRequest) {
    return res.status(400).json({ message: "Request already sent" });
  }

  const contactRequest = await ContactRequest.create({
    senderId,
    receiverId: receiver.id,
  });

  res.status(201).json(contactRequest);
});

module.exports = router;
