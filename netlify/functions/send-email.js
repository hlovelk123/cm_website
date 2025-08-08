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

  // --- Plain Text Template for Admin Notification ---
  const adminEmailText = `
You've received a new application from your "Coming Soon" page.

Name: ${fullName}
Email: ${email}
Contact: ${contact}
Reason for Joining:
${reason}
  `;

  // --- Plain Text Template for User Confirmation ---
  const userConfirmationText = `
Hi ${fullName},

We've successfully received your application to join the Leo Club of Colombo Millennium. We're excited to learn more about you!

Our team will review your submission, and we will get in touch with you within 3-5 business days.

Thank you for your interest in making a difference with us.

Sincerely,
The Leo Club of Colombo Millennium
  `;

  // --- Prepare Email Data for Two Separate API Calls ---
  const adminEmail = {
    from: { address: senderEmail, name: "Leo Club Submissions" },
    to: [{ email_address: { address: recipientEmail } }],
    subject: `New Application from ${fullName}!`,
    textbody: adminEmailText,
  };

  const userEmail = {
    from: { address: senderEmail, name: "Leo Club of Colombo Millennium" },
    to: [{ email_address: { address: email, name: fullName } }],
    subject: "We've Received Your Application!",
    textbody: userConfirmationText,
  };

  const sendEmail = async (emailData) => {
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
      throw new Error(`ZeptoMail API Error: ${errorBody}`);
    }
    return response.json();
  };

  try {
    // --- Send emails sequentially for better reliability ---
    await sendEmail(adminEmail);
    await sendEmail(userEmail);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent successfully" }),
    };
  } catch (error) {
    console.error('Error sending emails:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send one or more emails' }),
    };
  }
};
