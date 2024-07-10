const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
require("dotenv").config;

// Import the Environment Variables
const PORT = process.env.PORT || "8000";

// Create the Express Listener App
const app = express();

// JWT Check
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    ratelimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri:
      "https://indigo-lobster-5315.cic-demo-platform.auth0app.com/.well-known/jwks.json",
  }),
  audience: "https://email-notification-backend.vercel.app/",
  issuer: "https://indigo-lobster-5315.cic-demo-platform.auth0app.com/",
  algorithms: ["RS256"],
});

// Routes
app.get("/", (req, res) => {
  res.status(200);
  res.json({
    SERVICE: "Email Notification Backend",
    SERVICE_STATUS: "Running",
  });
});

// Protected Routes
app.get("/private", jwtCheck, (req, res) => {
  res.json({
    service: "Email Notification Backend Service",
    version: "1.0",
    author: "KR",
    api: {
      type: "private",
    },
  });
});

app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      status: "Invalid Token",
    });
  } else {
    next(err);
  }
});

// Start listening
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Email Notification Backend is listening on PORT ${PORT}`);
});

module.exports = app;
