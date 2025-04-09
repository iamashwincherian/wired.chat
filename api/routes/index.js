const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const userRoutes = require("./user");
const conversationRoutes = require("./conversation");
const contactRoutes = require("./contact");
const verificationRoutes = require("./verification");

// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);
router.use("/contacts", contactRoutes);
router.use("/verification", verificationRoutes);

// API version prefix
router.get("/", (req, res) => {
  res.json({
    message: "API v1",
    version: "1.0.0",
  });
});

module.exports = router;
