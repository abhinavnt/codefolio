import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  debug: true,
  logger: true,
});

export const sendOtpEmail = async (
  email: string,
  otp: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Your OTP Code for Verification",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <tr>
              <td>
                <div style="background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <!-- Header -->
                  <div style="background-color: #10b981; padding: 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Codefolio</h1>
                  </div>
                  
                  <!-- Content -->
                  <div style="padding: 30px 25px;">
                    <h2 style="color: #111827; font-size: 20px; margin-top: 0; margin-bottom: 15px;">Verification Required</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                      Please use the following code to complete your verification:
                    </p>
                    
                    <!-- OTP Code Box -->
                    <div style="background-color: #ecfdf5; border: 1px solid #10b981; border-radius: 6px; padding: 15px; text-align: center; margin-bottom: 25px;">
                      <span style="font-family: monospace; font-size: 28px; font-weight: bold; color: #10b981; letter-spacing: 5px;">${otp}</span>
                    </div>
                    
                    <p style="color: #4b5563; font-size: 14px; margin-bottom: 5px;">
                      This code will expire in <span style="font-weight: 600;">5 minutes</span>.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                      If you didn't request this code, please ignore this email.
                    </p>
                  </div>
                  
                  <!-- Footer -->
                  <div style="background-color: #f3f4f6; padding: 15px; text-align: center;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                      © ${new Date().getFullYear()} Codefolio. All rights reserved.
                    </p>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
};



export const sendForgotPasswordMail = async (email:string, magicLink:string) =>{
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${magicLink}">Reset Password</a></p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send OTP email");
  }
}



export const applicationRejectionMail = async (email: string, message: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Mentor Application Outcome",
      html: `
        <h2>Your Mentor Application</h2>
        <p>Dear Applicant,</p>
        <p>Thank you for applying to become a mentor with us. We appreciate the time and effort you invested in your application.</p>
        <p>After careful consideration, we regret to inform you that we are unable to move forward with your application at this time. ${message}</p>
        <p>We value your interest in mentoring and encourage you to apply again in the future if circumstances change. Your willingness to contribute to our community is greatly appreciated.</p>
        <p>If you have any questions or would like further feedback, please don’t hesitate to reach out to us.</p>
        <p>Best regards,<br>The Mentoring Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send rejection email");
  }
};