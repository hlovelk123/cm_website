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

  // --- Clean Dark Mode Admin Email ---
  const adminEmailHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
<div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 120px; height: auto;">
<h1 style="color: #ffffff; margin: 20px 0 0; font-size: 24px; font-weight: 600;">New Application Received</h1>
</div>
<div style="background-color: #1a1a1a; padding: 30px 20px;">
<div style="background-color: #2a2a2a; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
<h2 style="color: #ffffff; margin: 0 0 20px; font-size: 18px;">Applicant Details</h2>
<div style="margin-bottom: 15px;">
<p style="color: #94a3b8; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</p>
<p style="color: #ffffff; margin: 5px 0 0; font-size: 16px; font-weight: 500;">${fullName}</p>
</div>
<div style="margin-bottom: 15px;">
<p style="color: #94a3b8; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
<p style="color: #ffffff; margin: 5px 0 0; font-size: 16px; font-weight: 500;">${email}</p>
</div>
<div style="margin-bottom: 15px;">
<p style="color: #94a3b8; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Contact</p>
<p style="color: #ffffff; margin: 5px 0 0; font-size: 16px; font-weight: 500;">${contact}</p>
</div>
<div style="margin-bottom: 0;">
<p style="color: #94a3b8; margin: 0 0 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Reason for Joining</p>
<p style="color: #e2e8f0; margin: 0; font-size: 15px; line-height: 1.6; background-color: #374151; padding: 15px; border-radius: 6px;">${reason}</p>
</div>
</div>
<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
<p style="color: #64748b; margin: 0; font-size: 12px;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
</div>
</div>
</div>`;

  // --- Clean Dark Mode User Confirmation Email ---
  const userConfirmationHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border-radius: 8px; overflow: hidden;">
<div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 40px 20px; text-align: center;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 140px; height: auto; margin-bottom: 20px;">
<h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Welcome to Our Journey!</h1>
<p style="color: #e2e8f0; margin: 10px 0 0; font-size: 16px;">Your application has been received</p>
</div>
<div style="background-color: #1a1a1a; padding: 30px 20px;">
<div style="text-align: center; margin-bottom: 25px;">
<div style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 20px; font-size: 16px; font-weight: 500;">Thank You, ${fullName}!</div>
</div>
<div style="background-color: #2a2a2a; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
<p style="color: #ffffff; margin: 0 0 15px; font-size: 18px; line-height: 1.6; text-align: center;">We have successfully received your application to join the <strong style="color: #3b82f6;">Leo Club of Colombo Millennium</strong>.</p>
<p style="color: #e2e8f0; margin: 0; font-size: 16px; line-height: 1.6; text-align: center;">We are excited to learn more about you and your passion for service!</p>
</div>
<div style="background-color: #374151; border: 1px solid #4b5563; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
<div style="text-align: center; margin-bottom: 15px;">
<div style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Next Steps</div>
</div>
<p style="color: #ffffff; margin: 0 0 8px; font-size: 16px; text-align: center; font-weight: 500;">Our team will review your submission</p>
<p style="color: #3b82f6; margin: 0; font-size: 18px; text-align: center; font-weight: 600;">We will contact you within 3-5 business days</p>
</div>
<div style="background-color: #2a2a2a; padding: 20px; border-radius: 8px; text-align: center;">
<p style="color: #ffffff; margin: 0 0 5px; font-size: 16px; font-weight: 500;">Ready to make a difference together?</p>
<p style="color: #94a3b8; margin: 0; font-size: 14px;">Thank you for choosing to serve with Leo Club of Colombo Millennium</p>
</div>
<div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #374151;">
<p style="color: #64748b; margin: 0; font-size: 12px;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
</div>
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
