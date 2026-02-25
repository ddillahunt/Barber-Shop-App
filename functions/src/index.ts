import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

const brevoApiKey = defineSecret("BREVO_API_KEY");

const OWNER_EMAIL = "ddillahunt59@gmail.com";
const SENDER = { name: "Grandes Ligas Barber", email: OWNER_EMAIL };

// --- Security helpers ---

function escapeHtml(text: string): string {
  const map: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function sanitize(text: string | undefined, maxLength = 500): string {
  if (!text) return "";
  return escapeHtml(text.slice(0, maxLength).trim());
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

// Simple in-memory rate limiter (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests per window
const RATE_WINDOW_MS = 60 * 1000; // 1 minute

function checkRateLimit(key: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) {
    throw new HttpsError("resource-exhausted", "Too many requests. Please try again later.");
  }
}

// --- Types ---

interface EmailData {
  type: "shop_notification" | "customer_confirmation" | "reminder" | "contact_notification" | "contact_reply";
  name: string;
  email?: string;
  phone?: string;
  barber?: string;
  service?: string;
  date?: string;
  time?: string;
  notes?: string;
  message?: string;
}

function buildSubject(data: EmailData): string {
  const name = sanitize(data.name, 100);
  const date = sanitize(data.date, 20);
  switch (data.type) {
    case "shop_notification":
      return `New Appointment: ${name} - ${date || "No date"}`;
    case "customer_confirmation":
      return `Appointment Confirmed - Grandes Ligas Barber`;
    case "reminder":
      return `Appointment Reminder - Grandes Ligas Barber`;
    case "contact_notification":
      return `New Message from ${name}`;
    case "contact_reply":
      return `Thank you for contacting Grandes Ligas Barber`;
    default:
      return "Grandes Ligas Barber";
  }
}

function buildHtml(data: EmailData): string {
  // Sanitize all user inputs before embedding in HTML
  const name = sanitize(data.name, 100);
  const email = sanitize(data.email, 254);
  const phone = sanitize(data.phone, 20);
  const barber = sanitize(data.barber, 100);
  const service = sanitize(data.service, 100);
  const date = sanitize(data.date, 20);
  const time = sanitize(data.time, 20);
  const notes = sanitize(data.notes, 1000);
  const message = sanitize(data.message, 2000);

  const header = `
    <div style="background: linear-gradient(to right, #f59e0b, #eab308, #f59e0b); padding: 24px; text-align: center;">
      <h1 style="margin: 0; color: #000; font-size: 24px; font-weight: bold;">Grandes Ligas Barber Shop</h1>
    </div>`;

  const footer = `
    <div style="padding: 16px; text-align: center; color: #666; font-size: 12px;">
      <p>Grandes Ligas Barber Shop | (508) 872-5556</p>
    </div>`;

  switch (data.type) {
    case "shop_notification":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">New Appointment Booked</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${name}</td></tr>
              ${email ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;">${email}</td></tr>` : ""}
              ${phone ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>` : ""}
              ${barber ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Barber:</td><td style="padding: 8px;">${barber}</td></tr>` : ""}
              ${service ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px;">${service}</td></tr>` : ""}
              ${date ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Date:</td><td style="padding: 8px;">${date}</td></tr>` : ""}
              ${time ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Time:</td><td style="padding: 8px;">${time}</td></tr>` : ""}
              ${notes ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Notes:</td><td style="padding: 8px;">${notes}</td></tr>` : ""}
            </table>
          </div>
          ${footer}
        </div>`;

    case "customer_confirmation":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">Your Appointment is Confirmed!</h2>
            <p style="color: #555; font-size: 16px;">${message || `Hi ${name}, your appointment has been confirmed.`}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${date ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Date:</td><td style="padding: 8px;">${date}</td></tr>` : ""}
              ${time ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Time:</td><td style="padding: 8px;">${time}</td></tr>` : ""}
              ${barber ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Barber:</td><td style="padding: 8px;">${barber}</td></tr>` : ""}
              ${service ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px;">${service}</td></tr>` : ""}
            </table>
            <p style="color: #555; margin-top: 16px;">We look forward to seeing you!</p>
          </div>
          ${footer}
        </div>`;

    case "reminder":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">Appointment Reminder</h2>
            <p style="color: #555; font-size: 16px;">${message || `Hi ${name}, this is a reminder about your upcoming appointment.`}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${date ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Date:</td><td style="padding: 8px;">${date}</td></tr>` : ""}
              ${time ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Time:</td><td style="padding: 8px;">${time}</td></tr>` : ""}
              ${barber ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Barber:</td><td style="padding: 8px;">${barber}</td></tr>` : ""}
              ${service ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px;">${service}</td></tr>` : ""}
            </table>
          </div>
          ${footer}
        </div>`;

    case "contact_notification":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">New Contact Message</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${name}</td></tr>
              ${email ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;">${email}</td></tr>` : ""}
              ${phone ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;">${phone}</td></tr>` : ""}
            </table>
            ${message ? `<div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;"><p style="color: #333; margin: 0;">${message}</p></div>` : ""}
          </div>
          ${footer}
        </div>`;

    case "contact_reply":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">Thank You for Reaching Out!</h2>
            <p style="color: #555; font-size: 16px;">${message || "Thank you for your message. We&#039;ll get back to you shortly!"}</p>
            <p style="color: #555;">- The Grandes Ligas Barber Shop Team</p>
          </div>
          ${footer}
        </div>`;

    default:
      return `<p>${message || ""}</p>`;
  }
}

function getRecipient(data: EmailData): { email: string; name?: string } {
  switch (data.type) {
    case "shop_notification":
    case "contact_notification":
      return { email: OWNER_EMAIL, name: "Grandes Ligas Barber" };
    case "customer_confirmation":
    case "reminder":
    case "contact_reply":
      if (!data.email || !isValidEmail(data.email)) {
        throw new HttpsError("invalid-argument", "Valid customer email is required");
      }
      return { email: data.email, name: sanitize(data.name, 100) };
    default:
      throw new HttpsError("invalid-argument", "Invalid email type");
  }
}

export const sendEmail = onCall({ secrets: [brevoApiKey] }, async (request) => {
  const data = request.data as EmailData;

  // Validate required fields
  if (!data.type || !data.name || typeof data.name !== "string") {
    throw new HttpsError("invalid-argument", "Missing required fields: type, name");
  }

  // Validate email type
  const validTypes = ["shop_notification", "customer_confirmation", "reminder", "contact_notification", "contact_reply"];
  if (!validTypes.includes(data.type)) {
    throw new HttpsError("invalid-argument", "Invalid email type");
  }

  // Validate email format if provided
  if (data.email && !isValidEmail(data.email)) {
    throw new HttpsError("invalid-argument", "Invalid email address");
  }

  // Validate phone format if provided
  if (data.phone && !isValidPhone(data.phone)) {
    throw new HttpsError("invalid-argument", "Invalid phone number");
  }

  // Rate limit by caller IP or auth UID
  const rateLimitKey = request.auth?.uid || request.rawRequest?.ip || "anonymous";
  checkRateLimit(`email:${rateLimitKey}`);

  const recipient = getRecipient(data);
  const subject = buildSubject(data);
  const htmlContent = buildHtml(data);

  const payload = {
    sender: SENDER,
    to: [recipient],
    subject,
    htmlContent,
  };

  logger.info("Sending email", { type: data.type });

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": brevoApiKey.value(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("Brevo API error", { status: response.status, body: errorBody });
    throw new HttpsError("internal", "Failed to send email");
  }

  logger.info("Email sent successfully", { type: data.type });
  return { success: true };
});

// SMS via Brevo
interface SmsData {
  phone: string;
  message: string;
}

function formatPhoneForSms(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return "+" + digits;
}

export const sendSMS = onCall({ secrets: [brevoApiKey] }, async (request) => {
  const data = request.data as SmsData;

  if (!data.phone || !data.message || typeof data.message !== "string") {
    throw new HttpsError("invalid-argument", "Missing required fields: phone, message");
  }

  // Validate phone
  if (!isValidPhone(data.phone)) {
    throw new HttpsError("invalid-argument", "Invalid phone number");
  }

  // Truncate message to prevent abuse
  const cleanMessage = data.message.slice(0, 320).trim();
  if (!cleanMessage) {
    throw new HttpsError("invalid-argument", "Message cannot be empty");
  }

  // Rate limit
  const rateLimitKey = request.auth?.uid || request.rawRequest?.ip || "anonymous";
  checkRateLimit(`sms:${rateLimitKey}`);

  const recipient = formatPhoneForSms(data.phone);

  const payload = {
    type: "transactional",
    sender: "GrandsLigas",
    recipient,
    content: cleanMessage,
  };

  logger.info("Sending SMS");

  const response = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": brevoApiKey.value(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("Brevo SMS error", { status: response.status, body: errorBody });
    throw new HttpsError("internal", "Failed to send SMS");
  }

  logger.info("SMS sent successfully");
  return { success: true };
});

// Automated appointment reminders — runs every 15 minutes
function parseAppointmentDateTime(dateStr: string, timeStr: string): Date {
  // dateStr: "2026-02-24", timeStr: "2:00 PM"
  const [hourMin, period] = timeStr.split(" ");
  const [hourStr, minStr] = hourMin.split(":");
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  // Build date string in EST/EDT (America/New_York)
  const pad = (n: number) => n.toString().padStart(2, "0");
  const isoStr = `${dateStr}T${pad(hour)}:${pad(min)}:00`;

  // Convert local NY time to UTC
  const utcDate = new Date(isoStr + "Z");
  const nyOffset = new Date(utcDate.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const diff = utcDate.getTime() - nyOffset.getTime();
  return new Date(utcDate.getTime() + diff);
}

function getTodayInEST(): string {
  const now = new Date();
  const estStr = now.toLocaleDateString("en-CA", { timeZone: "America/New_York" }); // YYYY-MM-DD
  return estStr;
}

async function sendBrevoEmail(apiKey: string, to: { email: string; name?: string }, subject: string, htmlContent: string) {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: SENDER,
      to: [to],
      subject,
      htmlContent,
    }),
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo error ${response.status}: ${errorBody}`);
  }
}

export const sendAppointmentReminders = onSchedule(
  {
    schedule: "every 15 minutes",
    secrets: [brevoApiKey],
    timeZone: "America/New_York",
  },
  async () => {
    const today = getTodayInEST();
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    logger.info("Checking for appointment reminders", { today });

    const snapshot = await db.collection("appointments")
      .where("date", "==", today)
      .get();

    if (snapshot.empty) {
      logger.info("No appointments today");
      return;
    }

    let sentCount = 0;

    for (const doc of snapshot.docs) {
      const appt = doc.data();

      // Skip if reminder already sent
      if (appt.reminderSentAt) continue;

      // Skip if no email
      if (!appt.email) continue;

      // Parse appointment time and check if it's within the next hour
      try {
        const apptTime = parseAppointmentDateTime(appt.date, appt.time);
        if (apptTime <= now || apptTime > oneHourFromNow) continue;

        // Build and send reminder email (data from DB is sanitized in buildHtml)
        const emailData: EmailData = {
          type: "reminder",
          name: appt.name,
          email: appt.email,
          phone: appt.phone,
          barber: appt.barber,
          service: appt.service,
          date: appt.date,
          time: appt.time,
          message: `Hi ${escapeHtml(appt.name)}, this is a friendly reminder that your appointment is coming up today at ${escapeHtml(appt.time)}${appt.barber ? ` with ${escapeHtml(appt.barber.split(" - ")[0])}` : ""}. We look forward to seeing you!`,
        };

        const subject = buildSubject(emailData);
        const html = buildHtml(emailData);

        await sendBrevoEmail(
          brevoApiKey.value(),
          { email: appt.email, name: appt.name },
          subject,
          html
        );

        // Mark reminder as sent
        await doc.ref.update({ reminderSentAt: Timestamp.now() });
        sentCount++;

        logger.info("Reminder sent", { appointmentId: doc.id });
      } catch (err) {
        logger.error("Failed to send reminder", { appointmentId: doc.id, error: String(err) });
      }
    }

    logger.info(`Reminder check complete. Sent ${sentCount} reminders.`);
  }
);
