const express = require("express");
require("dotenv").config;

// Import the Environment Variables
const PORT = process.env.PORT || "8000";

// Create the Express Listener App
const app = express();

// Routes
app.get("/", (req, res) => {
  res.status(200);
  res.json({
    SERVICE: "Email Notification Backend",
    SERVICE_STATUS: "Running",
  });
});

// Start listening
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Email Notification Backend is listening on PORT ${PORT}`);
});

module.exports = app;
