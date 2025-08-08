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

  // --- Simplified HTML Template for Admin Notification (Avoid DKIM Issues) ---
  const adminEmailHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
<div style="text-align: center; margin-bottom: 20px;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 150px; height: auto;">
</div>
<h2 style="color: #333; margin-bottom: 20px;">New Application Received</h2>
<p style="color: #666; margin-bottom: 20px;">You have received a new application from the Coming Soon page.</p>
<hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
<p><strong>Name:</strong> ${fullName}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Contact:</strong> ${contact}</p>
<p><strong>Reason for Joining:</strong></p>
<p style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin: 10px 0;">${reason}</p>
<div style="text-align: center; margin-top: 30px; font-size: 14px; color: #999;">
<p>Leo Club of Colombo Millennium</p>
</div>
</div>`;

  // --- Simplified HTML Template for User Confirmation ---
  const userConfirmationHtml = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
<div style="text-align: center; margin-bottom: 20px;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 150px; height: auto;">
</div>
<h2 style="color: #333; margin-bottom: 20px;">Thank You for Your Application!</h2>
<p style="color: #666; margin-bottom: 15px;">Hi ${fullName},</p>
<p style="color: #666; margin-bottom: 15px;">We have successfully received your application to join the Leo Club of Colombo Millennium. We are excited to learn more about you!</p>
<p style="color: #666; margin-bottom: 15px;">Our team will review your submission, and we will get in touch with you within <strong>3-5 business days</strong>.</p>
<p style="color: #666; margin-bottom: 30px;">Thank you for your interest in making a difference with us.</p>
<div style="text-align: center; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 14px; color: #999;">
<p>Leo Club of Colombo Millennium</p>
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
