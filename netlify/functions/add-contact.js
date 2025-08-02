// This file should be placed in: /netlify/functions/add-contact.js

exports.handler = async function (event, context) {
  console.log("Function invoked.");

  if (event.httpMethod !== 'POST') {
    console.log("Method not allowed:", event.httpMethod);
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  // --- DEBUGGING LOGS ---
  // Let's see if the environment variables are accessible
  console.log("BREVO_API_KEY found:", !!apiKey); 
  console.log("BREVO_LIST_ID found:", !!listId, "(Value: " + listId + ")");

  let email;
  try {
    const body = JSON.parse(event.body);
    email = body.email;
    console.log("Received email from form:", email);
  } catch (error) {
    console.error("Could not parse request body:", error);
    return { statusCode: 400, body: 'Bad request: Could not parse JSON.' };
  }
  
  if (!email || !apiKey || !listId) {
    console.error("Validation failed: Missing email, API key, or List ID.");
    return { statusCode: 400, body: 'Missing email, API key, or List ID.' };
  }

  const contactData = {
    email: email,
    listIds: [parseInt(listId, 10)],
    updateEnabled: true
  };

  try {
    console.log("Sending data to Brevo...");
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Brevo API Error:', errorBody);
      return { statusCode: response.status, body: `Brevo API Error: ${errorBody}` };
    }

    const data = await response.json();
    console.log("Successfully added contact to Brevo.");
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Contact added successfully", data }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};