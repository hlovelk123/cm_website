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
  const adminEmailHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <title>Leo Club Application Notification</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    #outlook a { padding: 0; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    p { margin: 0; }
    
    /* Outlook specific styles */
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    
    /* Yahoo Mail specific styles */
    .yshortcuts a { border-bottom: none !important; }
    
    /* Gmail specific styles */
    u + .body .gmail-blend-screen { background: #000; mix-blend-mode: screen; }
    u + .body .gmail-blend-difference { background: #000; mix-blend-mode: difference; }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #1a1a1a !important; }
      .dark-mode-text { color: #ffffff !important; }
      .dark-mode-border { border-color: #333333 !important; }
    }
    
    /* Mobile styles */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-padding-top { padding-top: 20px !important; }
      .mobile-padding-bottom { padding-bottom: 20px !important; }
      .mobile-border-none { border-left: none !important; border-right: none !important; border-radius: 0 !important; }
      .mobile-text-22 { font-size: 22px !important; line-height: 26px !important; }
      .mobile-text-15 { font-size: 15px !important; line-height: 22px !important; }
      .mobile-text-14 { font-size: 14px !important; line-height: 20px !important; }
      .mobile-logo { max-width: 80px !important; }
      .mobile-form-text { font-size: 14px !important; line-height: 20px !important; }
    }
    
    @media only screen and (max-width: 480px) {
      .mobile-padding { padding-left: 15px !important; padding-right: 15px !important; }
      .mobile-text-20 { font-size: 20px !important; line-height: 24px !important; }
      .mobile-text-14 { font-size: 14px !important; line-height: 20px !important; }
      .mobile-form-text { font-size: 13px !important; line-height: 18px !important; }
    }
    
    /* Prevent auto-linking */
    .no-link a { color: inherit !important; text-decoration: none !important; }
  </style>
</head>
<body class="body" style="margin:0; padding:0; background-color:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!--[if mso | IE]>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="container" style="width:600px;" width="600">
    <tr>
      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]-->
  
  <div class="container" style="background-color:#f1f5f9; padding:40px 0;">
    <!--[if mso | IE]>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:12px; width:600px;" width="600">
      <tr>
        <td style="direction:ltr;font-size:0px;padding:40px;text-align:center;">
    <![endif]-->
    
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="container mobile-border-none" style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:12px; max-width:600px; width:100%;" width="100%">
      <tr>
        <td class="mobile-padding mobile-padding-top mobile-padding-bottom" style="padding:40px;">
          
          <!-- Logo Section -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" class="mobile-logo" style="border:0; display:block; height:auto; max-width:90px; width:100%;" width="90">
              </td>
            </tr>
          </table>
          
          <!-- Header Section -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <h1 class="mobile-text-22 mobile-text-20" style="color:#1e293b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:24px; font-weight:600; line-height:28px; margin:0 0 10px 0;">New Membership Application</h1>
                <p style="color:#64748b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:16px; line-height:20px; margin:0;">An application has been submitted by ${fullName}.</p>
              </td>
            </tr>
          </table>
          
          <!-- Divider -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="border-top:1px solid #e2e8f0; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Application Details -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <!-- Full Name -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding-bottom:15px;">
                      <p class="mobile-form-text" style="color:#334155; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:27px; margin:0;">
                        <strong>Full Name:</strong> ${fullName}
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Email -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding-bottom:15px;">
                      <p class="mobile-form-text" style="color:#334155; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:27px; margin:0;">
                        <strong>Email:</strong> <a href="mailto:${email}" style="color:#2563eb; text-decoration:none;">${email}</a>
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Contact -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding-bottom:15px;">
                      <p class="mobile-form-text" style="color:#334155; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:27px; margin:0;">
                        <strong>Contact:</strong> ${contact}
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Reason for Joining Label -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td>
                      <p class="mobile-form-text" style="color:#334155; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:27px; margin:0;">
                        <strong>Reason for Joining:</strong>
                      </p>
                    </td>
                  </tr>
                </table>
                
                <!-- Reason for Joining Content -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding-top:5px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border-radius:8px;">
                        <tr>
                          <td style="padding:15px;">
                            <p class="mobile-form-text" style="color:#334155; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:24px; margin:0; word-break:break-word;">
                              ${reason}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Disclaimer -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:40px;">
                <p class="mobile-text-14" style="color:#6b7280; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:11px; line-height:16px; margin:0; text-align:center;">
                  <strong>CONFIDENTIAL:</strong> The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without written consent of the sender. If you received this message by mistake, please reply to this message and delete it, so that we can avoid future issues.
                </p>
              </td>
            </tr>
          </table>

          <!-- Copyright -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:20px;">
                <p style="color:#94a3b8; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:16px; margin:0; text-align:center;">
                  © 2025 Leo Club of Colombo Millennium. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->
  </div>
  
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>`;

  // --- Professional Leo Club User Confirmation Email (Website Style) ---
  const userConfirmationHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <!--[if gte mso 9]>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
  <![endif]-->
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <!--<![endif]-->
  <title>Leo Club Application Confirmation</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    #outlook a { padding: 0; }
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
    p { margin: 0; }
    
    /* Outlook specific styles */
    .ExternalClass { width: 100%; }
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
    
    /* Yahoo Mail specific styles */
    .yshortcuts a { border-bottom: none !important; }
    
    /* Gmail specific styles */
    u + .body .gmail-blend-screen { background: #000; mix-blend-mode: screen; }
    u + .body .gmail-blend-difference { background: #000; mix-blend-mode: difference; }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      .dark-mode-bg { background-color: #1a1a1a !important; }
      .dark-mode-text { color: #ffffff !important; }
      .dark-mode-border { border-color: #333333 !important; }
    }
    
    /* Mobile styles */
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; max-width: 100% !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
      .mobile-padding-top { padding-top: 20px !important; }
      .mobile-padding-bottom { padding-bottom: 20px !important; }
      .mobile-border-none { border-left: none !important; border-right: none !important; border-radius: 0 !important; }
      .mobile-text-22 { font-size: 22px !important; line-height: 26px !important; }
      .mobile-text-15 { font-size: 15px !important; line-height: 22px !important; }
      .mobile-text-14 { font-size: 14px !important; line-height: 20px !important; }
      .mobile-logo { max-width: 80px !important; }
      .mobile-button { padding: 14px 20px !important; font-size: 16px !important; display: block !important; }
      .mobile-social-spacing { margin: 0 8px !important; }
    }
    
    @media only screen and (max-width: 480px) {
      .mobile-padding { padding-left: 15px !important; padding-right: 15px !important; }
      .mobile-text-20 { font-size: 20px !important; line-height: 24px !important; }
      .mobile-text-14 { font-size: 14px !important; line-height: 20px !important; }
    }
    
    /* Prevent auto-linking */
    .no-link a { color: inherit !important; text-decoration: none !important; }
  </style>
</head>
<body class="body" style="margin:0; padding:0; background-color:#f1f5f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <!--[if mso | IE]>
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="container" style="width:600px;" width="600">
    <tr>
      <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
  <![endif]-->
  
  <div class="container" style="background-color:#f1f5f9; padding:40px 0;">
    <!--[if mso | IE]>
    <table align="center" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:12px; width:600px;" width="600">
      <tr>
        <td style="direction:ltr;font-size:0px;padding:40px;text-align:center;">
    <![endif]-->
    
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="container mobile-border-none" style="background-color:#ffffff; border:1px solid #e2e8f0; border-radius:12px; max-width:600px; width:100%;" width="100%">
      <tr>
        <td class="mobile-padding mobile-padding-top mobile-padding-bottom" style="padding:40px;">
          
          <!-- Logo Section -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <img src="https://raw.githubusercontent.com/hlovelk123/website-assets/refs/heads/main/Club%20Logo%20Trans.png" alt="Leo Club Logo" class="mobile-logo" style="border:0; display:block; height:auto; max-width:90px; width:100%;" width="90">
              </td>
            </tr>
          </table>
          
          <!-- Header Section -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <h1 class="mobile-text-22 mobile-text-20" style="color:#1e293b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:24px; font-weight:600; line-height:28px; margin:0 0 10px 0;">Thank You, ${fullName}!</h1>
                <p style="color:#64748b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:16px; line-height:20px; margin:0;">Your application has been received.</p>
              </td>
            </tr>
          </table>
          
          <!-- Divider -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding:40px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="border-top:1px solid #e2e8f0; font-size:0; line-height:0;">&nbsp;</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Main Content -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center">
                <p class="mobile-text-15 mobile-text-14" style="color:#334155; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:16px; line-height:27px; margin:0; text-align:center;">
                  We're excited to review your application to join the <strong style="white-space:nowrap;">Leo Club of Colombo Millennium</strong>.<br>Our team will carefully go over your submission and will contact you within <strong>3-5 business days</strong> with the next steps.
                </p>
              </td>
            </tr>
          </table>
          
          <!-- CTA Button -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:40px;">
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://cmleos.org.lk" style="height:44px;v-text-anchor:middle;width:180px;" arcsize="18%" stroke="f" fillcolor="#2563eb">
                  <w:anchorlock/>
                  <center style="color:#ffffff;font-family:Arial, sans-serif;font-size:15px;font-weight:500;">Visit Our Website</center>
                </v:roundrect>
                <![endif]-->
                <!--[if !mso]><!-->
                <a href="https://cmleos.org.lk" class="mobile-button" style="background-color:#2563eb; border-radius:8px; color:#ffffff; display:inline-block; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; font-weight:500; line-height:20px; padding:12px 24px; text-align:center; text-decoration:none; -webkit-text-size-adjust:none; mso-hide:all;" target="_blank">Visit Our Website</a>
                <!--<![endif]-->
              </td>
            </tr>
          </table>
          
          <!-- Footer Text -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:30px;">
                <p class="mobile-text-14" style="color:#64748b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; margin:0; text-align:center;">
                  Thank you for choosing to serve with <span style="white-space:nowrap;">Leo Club of Colombo Millennium</span>
                </p>
                <p class="mobile-text-14" style="color:#64748b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:22px; margin:5px 0 0 0; text-align:center;">
                  Let's make a difference together
                </p>
              </td>
            </tr>
          </table>

          <!-- Reach Us Section -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="padding-top:30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
                  <tr>
                    <td style="padding:20px; text-align:center;">
                      <p style="color:#1e293b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:16px; font-weight:600; line-height:20px; margin:0 0 12px 0;">
                        Get in touch with us.
                      </p>
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" style="padding:4px 0;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:8px; vertical-align:middle;">
                                  <img src="https://static.zohocdn.com/toolkit/assets/e9f50d5df538b77aaf67.png" alt="Email" style="border:0; display:block; height:auto; vertical-align:middle;" width="16" height="16">
                                </td>
                                <td style="vertical-align:middle;">
                                  <a href="mailto:info@cmleos.org.lk" style="color:#2563eb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:20px; text-decoration:none; vertical-align:middle;">info@cmleos.org.lk</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:4px 0;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding-right:8px; vertical-align:middle;">
                                  <img src="https://static.zohocdn.com/toolkit/assets/8c62b345a3e98fbffcaa.png" alt="Mobile" style="border:0; display:block; height:auto; vertical-align:middle;" width="16" height="16">
                                </td>
                                <td style="vertical-align:middle;">
                                  <a href="tel:+94719108276" style="color:#2563eb; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; line-height:20px; text-decoration:none; vertical-align:middle;">+94 71 910 8276</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Social Media Links -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:40px;">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="https://web.facebook.com/CMillenniumLeos" target="_blank" style="text-decoration:none;">
                        <img src="https://static.zohocdn.com/toolkit/assets/f365fd888609adb4592a.png" alt="Facebook" style="border:0; display:block; height:auto; margin-right:15px;" width="24" height="24">
                      </a>
                    </td>
                    <td align="center">
                      <a href="https://www.instagram.com/millennium_leos" target="_blank" style="text-decoration:none;">
                        <img src="https://static.zohocdn.com/toolkit/assets/3581a585b3c1ed74caa7.png" alt="Instagram" style="border:0; display:block; height:auto; margin-right:15px;" width="24" height="24">
                      </a>
                    </td>
                    <td align="center">
                      <a href="https://www.linkedin.com/company/cmleos" target="_blank" style="text-decoration:none;">
                        <img src="https://static.zohocdn.com/toolkit/assets/44994ddd001121ef78ab.png" alt="LinkedIn" style="border:0; display:block; height:auto;" width="24" height="24">
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          
          <!-- Disclaimer -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:30px;">
                <p class="mobile-text-14" style="color:#6b7280; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:11px; line-height:16px; margin:0; text-align:center;">
                  <strong>CONFIDENTIAL:</strong> The content of this email is confidential and intended for the recipient specified in message only. It is strictly forbidden to share any part of this message with any third party, without written consent of the sender. If you received this message by mistake, please reply to this message and delete it, so that we can avoid future issues.
                </p>
              </td>
            </tr>
          </table>

          <!-- Copyright -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td align="center" style="padding-top:20px;">
                <p style="color:#94a3b8; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; line-height:16px; margin:0; text-align:center;">
                  © 2025 Leo Club of Colombo Millennium. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>
    
    <!--[if mso | IE]>
        </td>
      </tr>
    </table>
    <![endif]-->
  </div>
  
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>`;

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
