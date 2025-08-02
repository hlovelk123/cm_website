// This file should be placed in: /netlify/functions/add-contact.js

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body);
  const apiKey = process.env.BREVO_API_KEY;
  const listId = parseInt(process.env.BREVO_LIST_ID, 10);

  if (!email || !apiKey || !listId) {
    return { statusCode: 400, body: 'Missing email, API key, or List ID.' };
  }

  const contactData = {
    email: email,
    listIds: [listId],
    updateEnabled: true // This will add the contact if they don't exist, or update them if they do.
  };

  try {
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
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Contact added successfully", data }),
    };
  } catch (error) {
    console.error('Error adding contact:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add contact' }),
    };
  }
};
