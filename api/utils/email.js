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
