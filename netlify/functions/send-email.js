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

  // --- Beautiful HTML Template for Admin Notification (Blue Theme) ---
  const adminEmailHtml = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 2px; border-radius: 12px;">
<div style="background: #ffffff; border-radius: 10px; overflow: hidden;">
<div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; text-align: center;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 120px; height: auto; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">
<h1 style="color: #ffffff; margin: 20px 0 5px; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">New Application Alert</h1>
<p style="color: #ffffff; margin: 0; font-size: 16px; opacity: 0.9;">Someone wants to join our Leo family!</p>
</div>
<div style="padding: 40px;">
<div style="background: linear-gradient(45deg, #2563eb 0%, #1d4ed8 100%); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
<h2 style="color: #ffffff; margin: 0; font-size: 20px; text-align: center; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">Application Details</h2>
</div>
<div style="space-y: 20px;">
<div style="border-left: 4px solid #3b82f6; padding: 15px 20px; background: #eff6ff; border-radius: 0 8px 8px 0; margin-bottom: 15px;">
<p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 500;">FULL NAME</p>
<p style="margin: 5px 0 0; font-size: 18px; color: #1e3a8a; font-weight: 600;">${fullName}</p>
</div>
<div style="border-left: 4px solid #2563eb; padding: 15px 20px; background: #dbeafe; border-radius: 0 8px 8px 0; margin-bottom: 15px;">
<p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 500;">EMAIL ADDRESS</p>
<p style="margin: 5px 0 0; font-size: 18px; color: #1e3a8a; font-weight: 600;">${email}</p>
</div>
<div style="border-left: 4px solid #1d4ed8; padding: 15px 20px; background: #f0f9ff; border-radius: 0 8px 8px 0; margin-bottom: 15px;">
<p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 500;">CONTACT NUMBER</p>
<p style="margin: 5px 0 0; font-size: 18px; color: #1e3a8a; font-weight: 600;">${contact}</p>
</div>
<div style="border-left: 4px solid #60a5fa; padding: 15px 20px; background: #eff6ff; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
<p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 500;">WHY THEY WANT TO JOIN</p>
<p style="margin: 10px 0 0; font-size: 16px; color: #1e3a8a; line-height: 1.6;">${reason}</p>
</div>
</div>
<div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(45deg, #3b82f6, #1e3a8a); border-radius: 8px;">
<p style="color: #ffffff; margin: 0; font-size: 14px; opacity: 0.9;">Ready to welcome a new Leo?</p>
<p style="color: #ffffff; margin: 5px 0 0; font-size: 12px; opacity: 0.7;">Leo Club of Colombo Millennium</p>
</div>
<div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
<p style="color: #6b7280; margin: 0; font-size: 12px;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
</div>
</div>
</div>
</div>`;

  // --- Beautiful HTML Template for User Confirmation (Blue Theme) ---
  const userConfirmationHtml = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 2px; border-radius: 12px;">
<div style="background: #ffffff; border-radius: 10px; overflow: hidden;">
<div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 140px; height: auto; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2)); margin-bottom: 20px;">
<h1 style="color: #ffffff; margin: 0 0 10px; font-size: 32px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">Welcome to Our Journey!</h1>
<p style="color: #ffffff; margin: 0; font-size: 18px; opacity: 0.9;">Your application has been received</p>
</div>
<div style="padding: 40px;">
<div style="text-align: center; margin-bottom: 30px;">
<div style="display: inline-block; background: linear-gradient(45deg, #2563eb 0%, #1d4ed8 100%); padding: 15px 30px; border-radius: 25px;">
<p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600; text-shadow: 0 1px 3px rgba(0,0,0,0.3);">Thank You, ${fullName}!</p>
</div>
</div>
<div style="background: linear-gradient(45deg, #eff6ff, #dbeafe); padding: 30px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #bfdbfe;">
<p style="color: #1e3a8a; margin: 0 0 15px; font-size: 18px; line-height: 1.6; text-align: center;">We have successfully received your application to join the <strong style="color: #1e40af;">Leo Club of Colombo Millennium</strong>.</p>
<p style="color: #1e40af; margin: 0; font-size: 16px; line-height: 1.6; text-align: center;">We are excited to learn more about you and your passion for service!</p>
</div>
<div style="border: 2px solid #3b82f6; border-radius: 12px; padding: 25px; margin-bottom: 25px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);">
<div style="text-align: center; margin-bottom: 15px;">
<div style="display: inline-block; background: #3b82f6; color: #ffffff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">NEXT STEPS</div>
</div>
<p style="color: #1e3a8a; margin: 0 0 10px; font-size: 16px; text-align: center; font-weight: 600;">Our team will review your submission</p>
<p style="color: #1e40af; margin: 0; font-size: 20px; text-align: center; font-weight: 700;">We will contact you within 3-5 business days</p>
</div>
<div style="text-align: center; padding: 25px; background: linear-gradient(45deg, #3b82f6, #1e3a8a); border-radius: 12px;">
<p style="color: #ffffff; margin: 0 0 8px; font-size: 16px; font-weight: 600;">Ready to make a difference together?</p>
<p style="color: #ffffff; margin: 0; font-size: 14px; opacity: 0.9;">Thank you for choosing to serve with Leo Club of Colombo Millennium</p>
</div>
<div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
<p style="color: #6b7280; margin: 0 0 5px; font-size: 12px;">Leo Club of Colombo Millennium</p>
<p style="color: #6b7280; margin: 0; font-size: 12px;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
</div>
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
