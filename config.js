require("dotenv").config();

// Import the Environment Variables
const port = process.env.PORT || "8000";
const jwksUri = process.env.JWKS_URI;
const audience = process.env.AUD;
const issuer = process.env.ISS;
const domain = process.env.ISS;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const tokenUrl = `${domain}oauth/token`;
const cors1 = process.env.CORS_1;
const cors2 = process.env.CORS_2;
const session_secret = process.env.SESSION_SECRET;

module.exports = {
  auth: {
    port,
    jwksUri,
    audience,
    issuer,
    domain,
    client_id,
    client_secret,
    tokenUrl,
    cors1,
    cors2,
    session_secret,
  },
};
