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

  // --- HTML Template for User Confirmation (Based on your sample) ---
  const userConfirmationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #718096; height: 100%; line-height: 1.4; margin: 0; padding: 0; width: 100% !important; background-color: #edf2f7;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%; background-color: #edf2f7;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0; padding: 0; width: 100%;">
              <tr>
                <td style="padding: 25px 0; text-align: center;">
                  <a href="https://cmleos.org.lk/" style="font-size: 19px; font-weight: bold; text-decoration: none; display: inline-block; color: #3d4852;" target="_blank">
                    <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 100%; border: none; height: 75px; max-height: 75px; width: auto;">
                  </a>
                </td>
              </tr>
              <tr>
                <td width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 1px solid #edf2f7; border-top: 1px solid #edf2f7; margin: 0; padding: 0; width: 100%; background-color: #ffffff;">
                  <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; padding: 0; width: 570px;">
                    <tr>
                      <td style="max-width: 100vw; padding: 32px;">
                        <h1 style="font-size: 18px; font-weight: bold; margin-top: 0; text-align: left; color: #3d4852;">Thank You for Your Application!</h1>
                        <p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Hi ${fullName},</p>
                        <p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">We've successfully received your application to join the Leo Club of Colombo Millennium. We're excited to learn more about you!</p>
                        <p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Our team will review your submission, and we will get in touch with you within <strong>3-5 business days</strong>.</p>
                        <p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Thank you for your interest in making a difference with us.</p>
                        <p style="font-size: 16px; line-height: 1.5em; margin-top: 0; text-align: left;">Sincerely,<br>The Leo Club of Colombo Millennium</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; padding: 0; text-align: center; width: 570px;">
                    <tr>
                      <td align="center" style="max-width: 100vw; padding: 32px;">
                        <p style="line-height: 1.5em; margin-top: 0; font-size: 12px; text-align: center; color: #b0adc5;">© 2025 Leo Club of Colombo Millennium<br>All rights reserved</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
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
    htmlbody: userConfirmationHtml,
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
