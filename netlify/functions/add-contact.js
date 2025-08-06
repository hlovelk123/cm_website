// This file should be placed in: /netlify/functions/add-contact.js

// A helper function to get a fresh access token from Zoho
async function getZohoAccessToken() {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  const url = `https://accounts.zoho.com/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;

  const response = await fetch(url, { method: 'POST' });
  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Failed to refresh Zoho token:", errorBody);
    throw new Error('Failed to refresh Zoho token');
  }
  const data = await response.json();
  return data.access_token;
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body);
    const accessToken = await getZohoAccessToken();
    const listKey = process.env.ZOHO_LIST_KEY;

    // --- FIX: Use the 'listsubscribe' endpoint with contactinfo in the body ---
    const zohoApiUrl = `https://campaigns.zoho.com/api/v1.1/json/listsubscribe`;

    const response = await fetch(zohoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Zoho expects this specific endpoint to receive form-encoded data
      body: `resfmt=JSON&listkey=${listKey}&contactinfo=${JSON.stringify({"Contact Email": email})}`
    });
    
    // --- Enhanced Debugging ---
    const responseBodyText = await response.text();
    console.log("Response from Zoho API:", responseBodyText);

    if (!response.ok) {
      throw new Error(`Zoho API Error: Status ${response.status} - ${responseBodyText}`);
    }
    
    const responseJson = JSON.parse(responseBodyText);
    if (responseJson.status !== 'success') {
        throw new Error(`Zoho API Error: ${responseJson.message}`);
    }


    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Contact added successfully' }),
    };
  } catch (error) {
    console.error('Error in function execution:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add contact' }),
    };
  }
};
