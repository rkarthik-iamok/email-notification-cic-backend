const axios = require("axios");
const tokenService = require("../auth/tokenService");
const config = require("../config");

async function sendVerificationEmail(payload) {
  let responseData = {};
  try {
    const accessToken = await tokenService.getAccessToken();
    const url = `${config.auth.domain}api/v2/jobs/verification-email`;

    // Send the verification Email
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    responseData.data = response.data;
  } catch (error) {
    throw new Error(`Failed to send Verification Email: ${error} `);
  }

  return responseData.data;
}

async function checkJobStatus(jobId) {
  let responseData = {};
  try {
    const accessToken = await tokenService.getAccessToken();
    const url = `${config.auth.domain}api/v2/jobs/${jobId}`;

    // Send the verification Email
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    responseData.data = response.data;
  } catch (error) {
    throw new Error(`Unable to Fetch Email Job Details: ${error} `);
  }

  return responseData.data;
}

async function getEmailVerificationStatus(user_id) {
  let responseData = {};
  try {
    const accessToken = await tokenService.getAccessToken();
    const url = `${config.auth.domain}api/v2/users/auth0|${user_id}`;
    console.log(`URL: ${url}`);

    // Send the verification Email
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    responseData.data = response.data;
  } catch (error) {
    throw new Error(`Unable to User Details: ${error} `);
  }

  return responseData.data;
}

module.exports = {
  sendVerificationEmail,
  checkJobStatus,
  getEmailVerificationStatus,
};
