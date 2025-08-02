// This file should be placed in: /netlify/functions/send-email.js

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fullName, email, contact, reason } = JSON.parse(event.body);
  const apiKey = process.env.BREVO_API_KEY; // Access the API key from Netlify's environment variables

  // --- REPLACE WITH YOUR EMAIL ADDRESSES ---
  const senderEmail = 'SENDER_EMAIL_YOU_VERIFIED_IN_BREVO';
  const recipientEmail = 'YOUR_EMAIL_WHERE_YOU_WANT_TO_RECEIVE_APPLICATIONS';

  const emailData = {
    sender: { email: senderEmail },
    to: [{ email: recipientEmail }],
    subject: `New Application from ${fullName}!`,
    htmlContent: `
        <p>You've received a new application from your "Coming Soon" page.</p>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Reason for Joining:</strong></p>
        <p>${reason}</p>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      // Log the error from Brevo's API for debugging
      const errorBody = await response.text();
      console.error('Brevo API Error:', errorBody);
      return { statusCode: response.status, body: `Brevo API Error: ${errorBody}` };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ messageId: data.messageId }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
