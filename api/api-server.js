const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(helmet()); // Add security headers
app.use(morgan("dev")); // HTTP request logger
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

// Basic health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// API routes
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

module.exports = app;
