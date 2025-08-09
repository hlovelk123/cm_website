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

  // --- Professional Leo Club Admin Email (Website Style) ---
  const adminEmailHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 90px; height: auto;">
    </div>
    <div style="text-align: center;">
      <h1 style="font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 10px;">New Membership Application</h1>
      <p style="font-size: 16px; color: #64748b; margin: 0;">An application has been submitted by ${fullName}.</p>
    </div>
    <div style="margin: 40px 0; border-top: 1px solid #e2e8f0;"></div>
    <div style="font-size: 15px; color: #334155; line-height: 1.8; text-align: left;">
      <p style="margin: 0 0 15px;"><strong>Full Name:</strong> ${fullName}</p>
      <p style="margin: 0 0 15px;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a></p>
      <p style="margin: 0 0 15px;"><strong>Contact:</strong> ${contact}</p>
      <p style="margin: 0;"><strong>Reason for Joining:</strong></p>
      <p style="margin: 5px 0 0; padding: 15px; background-color: #f8fafc; border-radius: 8px;">${reason}</p>
    </div>
    <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
    </div>
  </div>`;

  // --- Professional Leo Club User Confirmation Email (Website Style) ---
  const userConfirmationHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 90px; height: auto;">
    </div>
    <div style="text-align: center;">
      <h1 style="font-size: 24px; font-weight: 600; color: #1e293b; margin: 0 0 10px;">Thank You, ${fullName}!</h1>
      <p style="font-size: 16px; color: #64748b; margin: 0;">Your application has been received.</p>
    </div>
    <div style="margin: 40px 0; border-top: 1px solid #e2e8f0;"></div>
    <div style="font-size: 16px; color: #334155; line-height: 1.7; text-align: center;">
      <p style="margin: 0;">We're excited to review your application to join the <br><strong>Leo Club of Colombo Millennium</strong>. <br>Our team will carefully go over your submission and will contact you within <br><strong>3-5 business days</strong> with the next steps.</p>
    </div>
    <div style="margin-top: 40px; text-align: center;">
      <a href="https://cmleos.org.lk" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 8px;">Visit Our Website</a>
    </div>
    <div style="margin-top: 30px; text-align: center; font-size: 14px; color: #64748b; line-height: 1.6;">
        <p style="margin: 0;">Thank you for choosing to serve with Leo Club of Colombo Millennium</p>
        <p style="margin: 5px 0 0;">Let's make a difference together</p>
    </div>
    <div style="margin-top: 40px; text-align: center;">
      <a href="https://web.facebook.com/CMillenniumLeos" target="_blank" style="text-decoration: none; margin-right: 15px;">
        <img src="https://static.zohocdn.com/toolkit/assets/f365fd888609adb4592a.png" width="24" alt="Facebook" style="border: 0; vertical-align: middle;">
      </a>
      <a href="https://www.instagram.com/millennium_leos" target="_blank" style="text-decoration: none; margin-right: 15px;">
        <img src="https://static.zohocdn.com/toolkit/assets/3581a585b3c1ed74caa7.png" width="24" alt="Instagram" style="border: 0; vertical-align: middle;">
      </a>
      <a href="https://www.linkedin.com/company/cmleos" target="_blank" style="text-decoration: none;">
        <img src="https://static.zohocdn.com/toolkit/assets/44994ddd001121ef78ab.png" width="24" alt="LinkedIn" style="border: 0; vertical-align: middle;">
      </a>
    </div>
    <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #94a3b8;">
      <p style="margin: 0;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
    </div>
  </div>`;

  // --- Prepare Email Data with Minimal Headers to Avoid DKIM Issues ---
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
    htmlbody: adminEmailHtml
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
    htmlbody: userConfirmationHtml
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
