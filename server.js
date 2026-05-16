// =============================================================
// EXPRESS SERVER — Entry Point
// Cloud-Based Office Administration Management System
// Backend: Node.js + Express + MongoDB (Mongoose)
// Future: Add authentication, rate limiting, logging middleware
// =============================================================

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// =============================================================
// MIDDLEWARE
// =============================================================

// Enable CORS — allows React frontend (localhost:3000) to call API
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
// e.g., GET /uploads/certificate-12345.pdf
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================================================
// API ROUTES
// All routes prefixed with /api for versioning readiness
// Future: /api/v2/... when upgrading
// =============================================================

const submissionRoutes = require("./routes/submissionRoutes");
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

// Future route placeholders (add when implementing later weeks)
// app.use("/api/students", require("./routes/studentRoutes"));
// app.use("/api/mentors", require("./routes/mentorRoutes"));
// app.use("/api/auth", require("./routes/authRoutes"));
// app.use("/api/attendance", require("./routes/attendanceRoutes"));
// app.use("/api/notifications", require("./routes/notificationRoutes"));

// =============================================================
// HEALTH CHECK ROUTE
// =============================================================
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Server is running",
    timestamp: new Date().toISOString(),
  });
});

// =============================================================
// 404 HANDLER — catch-all for unknown routes
// =============================================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// =============================================================
// GLOBAL ERROR HANDLER
// =============================================================
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =============================================================
// START SERVER
// =============================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || "development"}`);
});
