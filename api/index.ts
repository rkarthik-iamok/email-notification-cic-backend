const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const config = require("./config");
require("dotenv").config();
const emailVerificationService = require("./services/emailverification");

// Import the Environment Variables
const PORT = config.auth.port;

// console.log(`${jwksUri}, ${audience}, ${issuer}`);

// Create the Express Listener App
const app = express();

// JWT Check
const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    ratelimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth.jwksUri,
  }),
  audience: config.auth.audience,
  issuer: config.auth.issuer,
  algorithms: ["RS256"],
});

//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post("/sendverificationemail", jwtCheck, async (req, res) => {
  const payload = req.body;
  try {
    const response = await emailVerificationService.sendVerificationEmail(
      payload
    );
    return res.json(response);
  } catch (error) {
    console.log(`Unable to send Verification email, ${error}`);
    return res.json({
      status: "failed",
      reason: `${error}`,
    });
  }
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
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Email Notification Backend is listening on PORT ${PORT}`);
});

module.exports = app;
