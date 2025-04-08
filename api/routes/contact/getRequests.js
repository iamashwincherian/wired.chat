const express = require("express");
const { ContactRequest, User } = require("../../models");
const authenticate = require("../../middleware/auth");

const router = express.Router();

router.get("/requests", authenticate, async (req, res) => {
  const receiverId = req.user.id;

  const requests = await ContactRequest.findAll({
    where: {
      receiverId,
      status: "pending",
    },
    include: {
      model: User,
      as: "sender",
    },
  });

  res.status(201).json(requests);
});

module.exports = router;
