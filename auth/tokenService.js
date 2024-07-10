const axios = require("axios");
const config = require("../config");

let accessToken = null;
const tokenUrl = config.auth.tokenUrl;

async function fetchAccessToken() {
  try {
    const response = await axios.post(tokenUrl, {
      grant_type: "client_credentials",
      client_id: config.auth.client_id,
      client_secret: config.auth.client_secret,
    });

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw new Error(`Failed to Access Token: ${error}`);
  }
}

async function getAccessToken() {
  if (accessToken) {
    return accessToken;
  } else {
    return await fetchAccessToken();
  }
}

module.exports = {
  getAccessToken,
};
