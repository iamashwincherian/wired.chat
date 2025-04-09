const { Router } = require("express");
const { UserVerification } = require("../../models");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");

const router = Router();

router.post("/verify", async (req, res) => {
  const { userId, code } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const verificationRecord = await UserVerification.findOne({
    where: {
      userId,
      status: "pending",
      code,
    },
  });

  if (!verificationRecord) {
    return res.status(400).json({
      message: "Invalid or expired verification code",
      code: "INVALID",
    });
  }

  verificationRecord.status = "verified";
  user.status = "verified";
  await verificationRecord.save();
  await user.save();

  req.logIn(user, async (err) => {
    if (err) return next(err);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    return res.json({
      message: "Verified and Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
        verified: user.verified,
      },
      token,
    });
  });
});

module.exports = router;
