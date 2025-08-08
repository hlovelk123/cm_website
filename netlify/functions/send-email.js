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

  // --- HTML Template for Admin Notification ---
  const adminEmailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        strong { color: #000; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo">
        </div>
        <h2>New Application Received</h2>
        <p>You've received a new application from the 'Coming Soon' page.</p>
        <hr>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Contact:</strong> ${contact}</p>
        <p><strong>Reason for Joining:</strong></p>
        <p>${reason}</p>
      </div>
    </body>
    </html>
  `;

  // --- HTML Template for User Confirmation ---
  const userConfirmationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; color: #333; }
        .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header img { max-width: 150px; }
        .footer { font-size: 0.8em; color: #777; text-align: center; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo">
        </div>
        <h2>Thank You for Your Application!</h2>
        <p>Hi ${fullName},</p>
        <p>We've successfully received your application to join the Leo Club of Colombo Millennium. We're excited to learn more about you!</p>
        <p>Our team will review your submission, and we will get in touch with you within <strong>3-5 business days</strong>.</p>
        <p>Thank you for your interest in making a difference with us.</p>
        <div class="footer">
          <p>Leo Club of Colombo Millennium</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // --- Prepare Email Data for Two Separate API Calls ---
  const adminEmail = {
    from: { address: senderEmail, name: "Leo Club Submissions" },
    to: [{ email_address: { address: recipientEmail } }],
    subject: `New Application from ${fullName}!`,
    htmlbody: adminEmailHtml,
  };

  const userEmail = {
    from: { address: senderEmail, name: "Leo Club of Colombo Millennium" },
    to: [{ email_address: { address: email, name: fullName } }],
    subject: "We've Received Your Application!",
    htmlbody: userConfirmationHtml,
  };

  const sendEmail = async (emailData) => {
    const response = await fetch('https://api.zeptomail.com/v1.1/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Zoho-enczapikey ${zeptoToken}`, // CORRECTED HEADER FORMAT
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
    // Send both emails concurrently
    await Promise.all([
      sendEmail(adminEmail),
      sendEmail(userEmail)
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Emails sent successfully" }),
    };
  } catch (error) {
    console.error('Error sending emails:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send one or more emails' }),
    };
  }
};
