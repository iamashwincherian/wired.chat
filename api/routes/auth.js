const express = require("express");
const passport = require("passport");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
};

// Local authentication routes
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email already registered", email: "EXISTS" });
    }

    const user = await User.create({
      name,
      email,
      username: email,
      password,
      provider: "local",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.logIn(user, async (err) => {
      if (err) return next(err);

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET
      );

      return res.json({
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          createdAt: user.createdAt,
        },
        token,
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
    failWithError: true,
    passReqToCallback: true,
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.json({
      message: "Google authentication successful",
      user: req.user,
      token,
    });
  }
);

// GitHub authentication routes
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failWithError: true,
    passReqToCallback: true,
  }),
  (req, res) => {
    console.log("post auth with github");
    const token = generateToken(req.user);
    res.json({
      message: "GitHub authentication successful",
      user: req.user,
      token,
    });
  }
);

router.post("/logout", (req, res) => {
  req.logout();
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
