const axios = require("axios");
const tokenService = require("../auth/tokenService");
const config = require("../config");
const jsonwebtoken = require("jsonwebtoken");

async function sendVerificationEmail(payload) {
  let responseData = {};
  try {
    const accessToken = await tokenService.getAccessToken();
    const url = `${config.auth.domain}api/v2/jobs/verification-email`;

    console.log(`Payload: ${JSON.stringify(payload, null, 4)}`);

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

async function getApplicationLoginUri(appId) {
  let responseData = {};
  try {
    const accessToken = await tokenService.getAccessToken();
    const url = `${config.auth.domain}api/v2/clients/${appId}`;
    console.log(`URL: ${url}`);

    // Get the Application Settings
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    responseData.data = response.data;
  } catch (error) {
    throw new Error(`Unable to get Application Details: ${error} `);
  }

  return responseData.data;
}

async function getSessionTokenStatus(token) {
  // Validate the token
  let returnData = {};
  jsonwebtoken.verify(token, config.auth.session_secret, (err, decoded) => {
    if (err) {
      console.log(`Token is not valid: ${err}`);
      returnData.data = {
        status: "false",
        error: `${err}`,
      };
    } else {
      console.log(`Token is valid`);
      returnData.data = {
        status: true,
      };
    }
  });
  return returnData;
}

module.exports = {
  sendVerificationEmail,
  checkJobStatus,
  getEmailVerificationStatus,
  getApplicationLoginUri,
  getSessionTokenStatus,
};
