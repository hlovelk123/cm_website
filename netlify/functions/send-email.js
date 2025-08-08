// This file should be placed in: /netlify/functions/send-email.js

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fullName, email, contact, reason } = JSON.parse(event.body);
  const zeptoToken = process.env.ZEPTOMAIL_TOKEN;

  // --- REPLACE WITH YOUR EMAIL ADDRESSES ---
  const senderEmail = 'form@cmleos.org.lk'; 
  const recipientEmail = 'harrylklove@gmail.com';

  // --- A very simple plain text body for testing ---
  const textBody = `
    New Application Received:

    Name: ${fullName}
    Email: ${email}
    Contact: ${contact}
    Reason: ${reason}
  `;

  const emailData = {
    from: { address: senderEmail, name: "Leo Club Submissions" },
    to: [{ email_address: { address: recipientEmail } }],
    subject: `Test Application from ${fullName}`,
    textbody: textBody,
  };

  try {
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Zoho-enczapikey ${zeptoToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('ZeptoMail API Error:', errorBody);
      throw new Error(`ZeptoMail API Error: ${errorBody}`);
    }
    
    const data = await response.json();
    console.log("Email sent successfully:", data);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error('Error sending email:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
