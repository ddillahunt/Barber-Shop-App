import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const ses = new SESClient({ region: "us-east-1" });
const sns = new SNSClient({ region: "us-east-1" });

const OWNER_EMAIL = "ddillahunt59@gmail.com";
const SENDER_NAME = "Grandes Ligas Barber";

// CORS headers for browser requests
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

// --- Rate limiting (in-memory, resets on cold start) ---
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

function checkRateLimit(key) {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) {
    throw new Error("RATE_LIMITED");
  }
}

// --- Helpers ---

function escapeHtml(text) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function sanitize(text, maxLength = 500) {
  if (!text) return "";
  return escapeHtml(String(text).slice(0, maxLength).trim());
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

function formatPhoneForSms(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return "+1" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + digits;
  return "+" + digits;
}

// --- Email templates ---

function buildSubject(data) {
  const name = sanitize(data.name, 100);
  const date = sanitize(data.date, 20);
  switch (data.type) {
    case "shop_notification": return `New Appointment: ${name} - ${date || "No date"}`;
    case "customer_confirmation": return "Appointment Confirmed - Grandes Ligas Barber";
    case "appointment_update": return "Appointment Updated - Grandes Ligas Barber";
    case "reminder": return "Appointment Reminder - Grandes Ligas Barber";
    case "contact_notification": return `New Message from ${name}`;
    case "contact_reply": return "Thank you for contacting Grandes Ligas Barber";
    default: return "Grandes Ligas Barber";
  }
}

function buildHtml(data) {
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

  const row = (label, value) => value ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">${label}:</td><td style="padding: 8px;">${value}</td></tr>` : "";

  switch (data.type) {
    case "shop_notification":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">New Appointment Booked</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${name}</td></tr>
              ${row("Email", email)}${row("Phone", phone)}${row("Barber", barber)}${row("Service", service)}${row("Date", date)}${row("Time", time)}${row("Notes", notes)}
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
              ${row("Date", date)}${row("Time", time)}${row("Barber", barber)}${row("Service", service)}
            </table>
            <p style="color: #555; margin-top: 16px;">We look forward to seeing you!</p>
          </div>
          ${footer}
        </div>`;

    case "appointment_update": {
      const oldDate = sanitize(data.oldDate, 20);
      const oldTime = sanitize(data.oldTime, 20);
      const oldBarber = sanitize(data.oldBarber, 100);
      const oldService = sanitize(data.oldService, 100);
      const hl = "background-color: #FFFF00; font-weight: bold;";
      const changeRow = (label, value, old) => {
        const changed = old && old !== value;
        return value ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">${label}:</td><td style="padding: 8px;${changed ? ` ${hl}` : ""}">${value}${changed ? " (updated)" : ""}</td></tr>` : "";
      };
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">Your Appointment Has Been Updated</h2>
            <p style="color: #555; font-size: 16px;">Hi ${name}, your appointment details have been updated. Here are your new details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${changeRow("Date", date, oldDate)}${changeRow("Time", time, oldTime)}${changeRow("Barber", barber, oldBarber)}${changeRow("Service", service, oldService)}
            </table>
            <p style="color: #555; margin-top: 16px;">If you have any questions, please don't hesitate to contact us. We look forward to seeing you!</p>
          </div>
          ${footer}
        </div>`;
    }

    case "reminder":
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">Appointment Reminder</h2>
            <p style="color: #555; font-size: 16px;">${message || `Hi ${name}, this is a reminder about your upcoming appointment.`}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${row("Date", date)}${row("Time", time)}${row("Barber", barber)}${row("Service", service)}
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
              ${row("Email", email)}${row("Phone", phone)}
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

function getRecipientEmail(data) {
  switch (data.type) {
    case "shop_notification":
    case "contact_notification":
      return OWNER_EMAIL;
    case "customer_confirmation":
    case "appointment_update":
    case "reminder":
    case "contact_reply":
      if (!data.email || !isValidEmail(data.email)) throw new Error("INVALID_EMAIL");
      return data.email;
    default:
      throw new Error("INVALID_TYPE");
  }
}

// --- Handlers ---

async function handleSendEmail(data, sourceIp) {
  if (!data.type || !data.name || typeof data.name !== "string") {
    return { statusCode: 400, body: { error: "Missing required fields: type, name" } };
  }

  const validTypes = ["shop_notification", "customer_confirmation", "appointment_update", "reminder", "contact_notification", "contact_reply"];
  if (!validTypes.includes(data.type)) {
    return { statusCode: 400, body: { error: "Invalid email type" } };
  }

  if (data.email && !isValidEmail(data.email)) {
    return { statusCode: 400, body: { error: "Invalid email address" } };
  }

  if (data.phone && !isValidPhone(data.phone)) {
    return { statusCode: 400, body: { error: "Invalid phone number" } };
  }

  try {
    checkRateLimit(`email:${sourceIp}`);
  } catch {
    return { statusCode: 429, body: { error: "Too many requests. Please try again later." } };
  }

  let toEmail;
  try {
    toEmail = getRecipientEmail(data);
  } catch (err) {
    return { statusCode: 400, body: { error: err.message === "INVALID_EMAIL" ? "Valid customer email is required" : "Invalid email type" } };
  }

  const subject = buildSubject(data);
  const htmlContent = buildHtml(data);

  const command = new SendEmailCommand({
    Source: `${SENDER_NAME} <${OWNER_EMAIL}>`,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: { Html: { Data: htmlContent, Charset: "UTF-8" } },
    },
  });

  try {
    await ses.send(command);
    return { statusCode: 200, body: { success: true } };
  } catch (err) {
    console.error("SES error:", err);
    return { statusCode: 500, body: { error: "Failed to send email" } };
  }
}

async function handleSendSMS(data, sourceIp) {
  if (!data.phone || !data.message || typeof data.message !== "string") {
    return { statusCode: 400, body: { error: "Missing required fields: phone, message" } };
  }

  if (!isValidPhone(data.phone)) {
    return { statusCode: 400, body: { error: "Invalid phone number" } };
  }

  const cleanMessage = data.message.slice(0, 320).trim();
  if (!cleanMessage) {
    return { statusCode: 400, body: { error: "Message cannot be empty" } };
  }

  try {
    checkRateLimit(`sms:${sourceIp}`);
  } catch {
    return { statusCode: 429, body: { error: "Too many requests. Please try again later." } };
  }

  const phoneNumber = formatPhoneForSms(data.phone);

  const command = new PublishCommand({
    PhoneNumber: phoneNumber,
    Message: cleanMessage,
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": { DataType: "String", StringValue: "GrandesLigas" },
      "AWS.SNS.SMS.SMSType": { DataType: "String", StringValue: "Transactional" },
    },
  });

  try {
    await sns.send(command);
    return { statusCode: 200, body: { success: true } };
  } catch (err) {
    console.error("SNS error:", err);
    return { statusCode: 500, body: { error: "Failed to send SMS" } };
  }
}

// --- Lambda handler ---

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: "Invalid JSON" }),
    };
  }

  const { action, data } = body || {};
  const sourceIp = event.requestContext?.http?.sourceIp || "unknown";

  let result;
  switch (action) {
    case "sendEmail":
      result = await handleSendEmail(data, sourceIp);
      break;
    case "sendSMS":
      result = await handleSendSMS(data, sourceIp);
      break;
    default:
      result = { statusCode: 400, body: { error: "Invalid action. Use 'sendEmail' or 'sendSMS'." } };
  }

  return {
    statusCode: result.statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(result.body),
  };
};
