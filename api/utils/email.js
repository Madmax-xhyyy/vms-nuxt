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
