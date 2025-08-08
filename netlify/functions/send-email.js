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
  const adminEmailHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e5e9; border-radius: 12px; overflow: hidden;">
<div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px 20px; text-align: center;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 100px; height: auto; margin-bottom: 15px;">
<h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">Leo Club of Colombo Millennium</h1>
<p style="color: #e6f0ff; margin: 8px 0 0; font-size: 14px; font-weight: 400;">New Application Received</p>
</div>
<div style="background-color: #ffffff; padding: 30px 20px;">
<div style="background-color: #f8fafc; border: 1px solid #e1e5e9; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
<h2 style="color: #1e293b; margin: 0 0 20px; font-size: 18px; font-weight: 600;">Application Details</h2>
<table style="width: 100%; border-collapse: collapse;">
<tr style="border-bottom: 1px solid #e1e5e9;">
<td style="padding: 12px 0; font-size: 14px; color: #64748b; font-weight: 500; width: 30%;">Full Name</td>
<td style="padding: 12px 0; font-size: 15px; color: #1e293b; font-weight: 500;">${fullName}</td>
</tr>
<tr style="border-bottom: 1px solid #e1e5e9;">
<td style="padding: 12px 0; font-size: 14px; color: #64748b; font-weight: 500;">Email</td>
<td style="padding: 12px 0; font-size: 15px; color: #1e293b; font-weight: 500;">${email}</td>
</tr>
<tr style="border-bottom: 1px solid #e1e5e9;">
<td style="padding: 12px 0; font-size: 14px; color: #64748b; font-weight: 500;">Contact</td>
<td style="padding: 12px 0; font-size: 15px; color: #1e293b; font-weight: 500;">${contact}</td>
</tr>
<tr>
<td style="padding: 12px 0 0; font-size: 14px; color: #64748b; font-weight: 500; vertical-align: top;">Reason</td>
<td style="padding: 12px 0 0; font-size: 15px; color: #1e293b; line-height: 1.6;">${reason}</td>
</tr>
</table>
</div>
<div style="text-align: center; padding: 15px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b82f6;">
<p style="color: #1e293b; margin: 0; font-size: 14px; font-weight: 500;">Ready to welcome a new Leo to the family?</p>
</div>
<div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e1e5e9;">
<p style="color: #64748b; margin: 0; font-size: 12px;">© 2025 Leo Club of Colombo Millennium. All rights reserved.</p>
</div>
</div>
</div>`;

  // --- Professional Leo Club User Confirmation Email (Website Style) ---
  const userConfirmationHtml = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e1e5e9; border-radius: 12px; overflow: hidden;">
<div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
<img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" style="max-width: 110px; height: auto; margin-bottom: 20px;">
<h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Leo Club of Colombo Millennium</h1>
<p style="color: #e6f0ff; margin: 10px 0 0; font-size: 16px;">Welcome to Our Leo Family!</p>
</div>
<div style="background-color: #ffffff; padding: 30px 20px;">
<div style="text-align: center; margin-bottom: 25px;">
<div style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 10px 20px; border-radius: 6px; font-size: 15px; font-weight: 500;">Thank You, ${fullName}!</div>
</div>
<div style="background-color: #f8fafc; border: 1px solid #e1e5e9; border-radius: 8px; padding: 25px; margin-bottom: 20px; text-align: center;">
<h2 style="color: #1e293b; margin: 0 0 15px; font-size: 18px; font-weight: 600;">Application Successfully Received</h2>
<p style="color: #475569; margin: 0 0 15px; font-size: 15px; line-height: 1.6;">We have successfully received your application to join the <br><strong style="color: #1e40af;">Leo Club of Colombo Millennium</strong></p>
<p style="color: #475569; margin: 0; font-size: 15px; line-height: 1.6;">We are excited to learn more about you and your passion for service!</p>
</div>
<div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
<div style="text-align: center; margin-bottom: 15px;">
<div style="display: inline-block; background-color: #1e40af; color: #ffffff; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Next Steps</div>
</div>
<div style="text-align: center;">
<p style="color: #1e293b; margin: 0 0 8px; font-size: 15px; font-weight: 500;">Our team will review your submission</p>
<p style="color: #1e293b; margin: 0 0 8px; font-size: 15px; font-weight: 500;">&</p>
<p style="color: #1e40af; margin: 0; font-size: 17px; font-weight: 600;">We will contact you within 3-5 business days</p>
</div>
</div>
<div style="background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #3b82f6; padding: 20px; text-align: center;">
<p style="color: #1e293b; margin: 0 0 5px; font-size: 15px; font-weight: 500;">Ready to make a difference together?</p>
<p style="color: #64748b; margin: 0; font-size: 14px;">Thank you for choosing to serve with Leo Club of Colombo Millennium</p>
</div>
<div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #e1e5e9;">
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
