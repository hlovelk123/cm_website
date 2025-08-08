// This file should be placed in: /netlify/functions/send-email.js

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { fullName, email, contact, reason } = JSON.parse(event.body);
  const zeptoToken = process.env.ZEPTOMAIL_TOKEN;

  // --- IMPORTANT: Use verified domain from ZeptoMail ---
  const senderEmail = 'noreply@cmleos.org.lk'; // Changed from 'form@' to 'noreply@' for better deliverability
  const recipientEmail = 'harrylklove@gmail.com';
  const replyToEmail = 'info@cmleos.org.lk'; // Use a professional reply-to address

  // --- Clean HTML Template for Admin Notification ---
  const adminEmailHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px;">
                            <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 150px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">New Application Received</h2>
                            <p style="color: #666666; margin: 0 0 20px; line-height: 1.6;">You've received a new application from the 'Coming Soon' page.</p>
                            <hr style="border: none; border-top: 1px solid #eeeeee; margin: 20px 0;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 10px 0;"><strong style="color: #333333;">Name:</strong></td>
                                    <td style="padding: 10px 0; color: #666666;">${fullName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong style="color: #333333;">Email:</strong></td>
                                    <td style="padding: 10px 0; color: #666666;">${email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0;"><strong style="color: #333333;">Contact:</strong></td>
                                    <td style="padding: 10px 0; color: #666666;">${contact}</td>
                                </tr>
                            </table>
                            <p style="color: #333333; margin: 20px 0 10px;"><strong>Reason for Joining:</strong></p>
                            <p style="color: #666666; margin: 0 0 30px; line-height: 1.6; background-color: #f9f9f9; padding: 15px; border-radius: 4px;">${reason}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // --- Clean HTML Template for User Confirmation ---
  const userConfirmationHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px;">
                            <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 150px; height: auto;">
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 0 30px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px; font-size: 24px;">Thank You for Your Application!</h2>
                            <p style="color: #666666; margin: 0 0 15px; line-height: 1.6;">Hi ${fullName},</p>
                            <p style="color: #666666; margin: 0 0 15px; line-height: 1.6;">We've successfully received your application to join the Leo Club of Colombo Millennium. We're excited to learn more about you!</p>
                            <p style="color: #666666; margin: 0 0 15px; line-height: 1.6;">Our team will review your submission, and we will get in touch with you within <strong style="color: #333333;">3-5 business days</strong>.</p>
                            <p style="color: #666666; margin: 0 0 30px; line-height: 1.6;">Thank you for your interest in making a difference with us.</p>
                            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; margin: 0; font-size: 14px;">Leo Club of Colombo Millennium</p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  // --- Prepare Email Data with Better Headers ---
  const adminEmail = {
    from: { 
      address: senderEmail, 
      name: "Leo Club Application System" 
    },
    to: [{ 
      email_address: { 
        address: recipientEmail,
        name: "Admin"
      } 
    }],
    reply_to: [{ 
      address: replyToEmail,
      name: "Leo Club Admin"
    }],
    subject: `New Leo Club Application - ${fullName}`,
    htmlbody: adminEmailHtml,
    track_clicks: false,
    track_opens: false,
    // Add custom headers for better deliverability
    custom_headers: {
      "X-Priority": "3",
      "X-Mailer": "Leo Club Application System",
      "List-Unsubscribe": `mailto:${replyToEmail}?subject=unsubscribe`
    }
  };

  const userEmail = {
    from: { 
      address: senderEmail, 
      name: "Leo Club of Colombo Millennium" 
    },
    to: [{ 
      email_address: { 
        address: email, 
        name: fullName 
      } 
    }],
    reply_to: [{ 
      address: replyToEmail,
      name: "Leo Club of Colombo Millennium"
    }],
    subject: "Application Received - Leo Club of Colombo Millennium",
    htmlbody: userConfirmationHtml,
    track_clicks: false,
    track_opens: false,
    // Add custom headers for better deliverability
    custom_headers: {
      "X-Priority": "3",
      "X-Mailer": "Leo Club Application System",
      "List-Unsubscribe": `mailto:${replyToEmail}?subject=unsubscribe`
    }
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
      throw new Error(`ZeptoMail API Error: ${response.status} - ${errorBody}`);
    }
    return response.json();
  };

  try {
    // --- Send emails with better error handling ---
    console.log('Sending admin notification...');
    const adminResult = await sendEmail(adminEmail);
    console.log('Admin email sent:', adminResult);

    console.log('Sending user confirmation...');
    const userResult = await sendEmail(userEmail);
    console.log('User email sent:', userResult);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        message: "Emails sent successfully",
        adminEmailId: adminResult?.data?.[0]?.message_id,
        userEmailId: userResult?.data?.[0]?.message_id
      }),
    };
  } catch (error) {
    console.error('Error sending emails:', error.message);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Failed to send emails',
        details: error.message 
      }),
    };
  }
};
