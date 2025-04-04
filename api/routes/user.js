const express = require("express");
const { User, ContactRequest } = require("../models");
const { Op } = require("sequelize");
const authenticate = require("../middleware/auth");

const router = express.Router();

router.get("/search", authenticate, async (req, res) => {
  const { email } = req.query;

  const user = await User.findAll({
    where: { email },
    include: { model: ContactRequest, as: "receivedRequests" },
    attributes: {
      exclude: ["password", "googleId", "createdAt", "updatedAt"],
    },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: { id },
    attributes: ["id", "name", "email"],
  });

  res.json(user);
});

module.exports = router;
