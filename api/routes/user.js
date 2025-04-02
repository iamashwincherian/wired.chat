const express = require("express");
const { User } = require("../models");
const { Op } = require("sequelize");
const authenticate = require("../middleware/auth");

const router = express.Router();

// Get all users except the current user
router.get("/", authenticate, async (req, res) => {
  const users = await User.findAll({
    where: {
      id: {
        [Op.ne]: req.user.id,
      },
    },
    attributes: ["id", "name", "email", "username", "avatar", "lastSeen"],
    order: [["username", "ASC"]],
  });

  res.json(users);
});

module.exports = router;
