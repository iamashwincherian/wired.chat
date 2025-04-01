const express = require("express");
const passport = require("passport");
const { User } = require("../models");
const router = express.Router();

// Local authentication routes
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      email,
      password,
      username,
      provider: "local",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      });
    });
  })(req, res, next);
});

// Google authentication routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

router.post("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
