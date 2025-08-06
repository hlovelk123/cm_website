// This file should be placed in: /netlify/functions/add-contact.js

// A helper function to get a fresh access token from Zoho
async function getZohoAccessToken() {
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;

  // --- IMPORTANT: CHECK YOUR ZOHO DATA CENTER ---
  // If your Zoho account URL ends in .eu, .in, .com.au, etc., change this value.
  const zohoDomain = "com"; // Change to "eu", "in", etc. if needed.

  const url = `https://accounts.zoho.${zohoDomain}/oauth/v2/token?refresh_token=${refreshToken}&client_id=${clientId}&client_secret=${clientSecret}&grant_type=refresh_token`;

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

    // --- IMPORTANT: CHECK YOUR ZOHO DATA CENTER ---
    // This should match the domain used in getZohoAccessToken
    const zohoDomain = "com"; // Change to "eu", "in", etc. if needed.
    const zohoApiUrl = `https://campaigns.zoho.${zohoDomain}/api/v1.1/json/listsubscribe`;

    // Correctly format the body for application/x-www-form-urlencoded
    const contactInfo = JSON.stringify({ "Contact Email": email });
    const encodedBody = `resfmt=JSON&listkey=${listKey}&contactinfo=${encodeURIComponent(contactInfo)}`;

    const response = await fetch(zohoApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodedBody
    });
    
    // --- Enhanced Debugging ---
    const responseBodyText = await response.text();
    console.log("Response from Zoho API:", responseBodyText);

    if (!response.ok) {
      throw new Error(`Zoho API Error: Status ${response.status} - ${responseBodyText}`);
    }
    
    const responseJson = JSON.parse(responseBodyText);
    // Handle cases where the contact is already subscribed, which Zoho treats as a success.
    if (responseJson.status !== 'success' && responseJson.message !== 'Contact already subscribed.') {
        // Handle specific error codes from the Zoho response if necessary
        if (responseJson.code === 2402) { // Example: Contact is in Do-Not-Mail
             console.log("Contact is in Do-Not-Mail registry.");
             // Decide if this should be an error or a specific success message
        } else {
            throw new Error(`Zoho API Error: ${responseJson.message}`);
        }
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
