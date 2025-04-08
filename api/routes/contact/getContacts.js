const express = require("express");
const { User, Contact } = require("../../models");
const authenticate = require("../../middleware/auth");
const { Op, literal } = require("sequelize");

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  const userId = req.user.id;

  const contacts = await Contact.findAll({
    where: {
      [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: [
      {
        model: User,
        as: "user1",
        attributes: ["id", "name", "email", "avatar"],
        where: {
          id: {
            [Op.ne]: userId,
          },
        },
        required: false,
      },
      {
        model: User,
        as: "user2",
        attributes: ["id", "name", "email", "avatar"],
        where: {
          id: {
            [Op.ne]: userId,
          },
        },
        required: false,
      },
    ],
    attributes: {
      include: [
        [
          literal(
            `CASE WHEN "Contact"."user1Id" = :userId THEN to_json("user2") ELSE to_json("user1") END`
          ),
          "user",
        ],
      ],
      exclude: ["user1", "user2", "user1Id", "user2Id"],
    },
    replacements: { userId },
  });

  res.status(201).json(contacts);
});

module.exports = router;
