import Brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevoClient = new Brevo.TransactionalEmailsApi();

brevoClient.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export const sendAppointmentConfirmationEmail = async ({
  to,
  fullName,
  code,
  dateTime,
}) => {
  const dt = new Date(dateTime);
  const emailData = {
    sender: {
      email: process.env.BREVO_USER,
      name: "VMS Clinic",
    },
    to: [
      {
        email: to,
        name: fullName,
      },
    ],
    subject: "Appointment Confirmed ✅",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Appointment Confirmation</h2>
        <p>Dear ${fullName},</p>
        <p>Your appointment has been <strong>confirmed</strong>.</p>

        <p>
          <strong>Date:</strong> ${dt.toLocaleDateString()}<br>
          <strong>Time:</strong> ${dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}<br>
          <strong>Appointment Code:</strong> ${code}
        </p>

        <p>We look forward to seeing you!</p>
      </div>
    `,
  };

  try {
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Brevo API error:", error.response?.body || error.message);
  }
};
export const sendResetPasswordEmail = async ({ to, fullName, link }) => {
  const emailData = {
    sender: {
      email: process.env.BREVO_USER,
      name: "VMS Clinic",
    },
    to: [
      {
        email: to,
        name: fullName,
      },
    ],
    subject: "Reset Your Password 🔑",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Dear ${fullName},</p>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <p>
          <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>
    `,
  };

  try {
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Reset email sent to ${to}`);
  } catch (error) {
    console.error("Brevo API error:", error.response?.body || error.message);
  }
};

export const sendContactInquiryEmail = async ({
  to,
  senderName,
  senderEmail,
  senderPhone,
  message,
}) => {
  const emailData = {
    sender: {
      email: process.env.BREVO_USER,
      name: "VMS Clinic - Inquiry System",
    },
    to: [
      {
        email: to,
        name: "Clinic Administrator",
      },
    ],
    subject: `New Inquiry from ${senderName} 📧`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2 style="color: #007bff;">New Contact Form Submission</h2>
        <p>You have received a new message from the contact us page:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">
          <p><strong>Name:</strong> ${senderName}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          <p><strong>Phone:</strong> ${senderPhone || "Not provided"}</p>
          <hr style="border: 0; border-top: 1px solid #dee2e6; margin: 15px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <p style="font-size: 0.9em; color: #6c757d; margin-top: 20px;">
          This inquiry was sent from the Furever Clinic website.
        </p>
      </div>
    `,
  };

  try {
    await brevoClient.sendTransacEmail(emailData);
    console.log(`Contact inquiry email sent to ${to}`);
  } catch (error) {
    console.error("Brevo API error:", error.response?.body || error.message);
  }
};
