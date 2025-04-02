const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const userRoutes = require("./user");
const conversationRoutes = require("./conversation");
// Health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Auth routes
router.use("/auth", authRoutes);

// User routes - protected by authentication
router.use("/users", userRoutes);
router.use("/conversations", conversationRoutes);

// API version prefix
router.get("/", (req, res) => {
  res.json({
    message: "API v1",
    version: "1.0.0",
  });
});

module.exports = router;
