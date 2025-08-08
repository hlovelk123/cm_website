// This file should be placed in: /netlify/functions/send-email.js

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fullName, email, contact, reason } = JSON.parse(event.body);
  const zeptoToken = process.env.ZEPTOMAIL_TOKEN;

  // --- REPLACE WITH YOUR EMAIL ADDRESSES ---
  // This must be an email address from the domain you verified in ZeptoMail.
  const senderEmail = 'form@cmleos.org.lk'; 
  const recipientEmail = 'harrylklove@gmail.com';

  // --- FIX: Using a very clean plain text body to ensure DKIM passes ---
  const textBody = [
    `You've received a new application from your "Coming Soon" page.`,
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Contact: ${contact}`,
    `Reason for Joining:`,
    reason
  ].join('\n\n');

  const emailData = {
    from: { address: senderEmail, name: "Leo Club Submissions" },
    to: [{ email_address: { address: recipientEmail } }],
    subject: `New Application from ${fullName}!`,
    textbody: textBody,
  };

  try {
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': zeptoToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('ZeptoMail API Error:', errorBody);
      return { statusCode: response.status, body: `ZeptoMail API Error: ${errorBody}` };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully", data }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
