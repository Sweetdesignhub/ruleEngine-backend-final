/**
 * File: email.util.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,             
  secure: false,     
  auth: {
    user: "9295dc5e4a527c", 
    pass: "a4ed70cdc72ca2",
  },
});

// Send email verification link
export const sendVerificationEmail = async (email, emailHTML) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email,                    
      subject: "Email Verification", 
      html: emailHTML,  
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", result.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    throw error;
  }
};
