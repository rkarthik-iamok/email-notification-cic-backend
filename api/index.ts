const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const config = require("../config");
require("dotenv").config();
const emailVerificationService = require("../services/emailverification");

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
// Sample Private Route
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

// Route to Send Verification Email
app.post("/sendverificationemail", jwtCheck, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log(`Request Object: ${JSON.stringify(req.auth, null, 4)}`);

  // Build the payload from Decoded Access Token
  const payload = {
    user_id: `auth0|${req.auth.user_id}`,
    client_id: `${req.auth.azp}`,
    identity: {
      user_id: `${req.auth.user_id}`,
      provider: "auth0",
    },
  };

  // Send the Verification Email
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

// Route to check Job Status

app.get("/checkjobstatus/:id", jwtCheck, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  const jobId = req.params.id;
  console.log(`Job ID: ${jobId}`);

  // Send the Verification Email
  try {
    const response = await emailVerificationService.checkJobStatus(jobId);
    return res.json(response);
  } catch (error) {
    console.log(`Unable to check Job Status, ${error}`);
    return res.json({
      status: "failed",
      reason: `${error}`,
    });
  }
});

app.get("/getEmailVerificationStatus", jwtCheck, async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  console.log(`Request Object: ${JSON.stringify(req.auth, null, 4)}`);

  // Send the Verification Email
  try {
    const response = await emailVerificationService.getEmailVerificationStatus(
      req.auth.user_id
    );

    // Process the output
    let verification_status = response.email_verified == true ? "true" : false;
    return res.json({
      status: verification_status,
    });
  } catch (error) {
    console.log(
      `Unable to check Email Verification Status for the user, ${error}`
    );
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
