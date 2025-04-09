const { Router } = require("express");
const nodemailer = require("nodemailer");

const { UserVerification } = require("../../models");
const User = require("../../models/User");

const router = Router();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/send", async (req, res) => {
  const { userId } = req.body;

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const [verification, created] = await UserVerification.findOrCreate({
    where: {
      userId,
      status: "pending",
    },
    defaults: {
      code,
    },
  });

  if (!created) {
    verification.code = code;
    await verification.save();
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Wired.Chat - Verification Code",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Failed to send verification code" });
    }

    console.log("Message sent: %s", info.messageId);
  });

  return res
    .status(200)
    .json({ message: "Verification code sent to your email" });
});

module.exports = router;
