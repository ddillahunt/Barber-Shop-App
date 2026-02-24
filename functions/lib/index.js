"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.sendEmail = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const firebase_functions_1 = require("firebase-functions");
const brevoApiKey = (0, params_1.defineSecret)("BREVO_API_KEY");
const OWNER_EMAIL = "ddillahunt59@gmail.com";
const SENDER = { name: "Grandes Ligas Barber", email: OWNER_EMAIL };
function buildSubject(data) {
    switch (data.type) {
        case "shop_notification":
            return `New Appointment: ${data.name} - ${data.date || "No date"}`;
        case "customer_confirmation":
            return `Appointment Confirmed - Grandes Ligas Barber`;
        case "reminder":
            return `Appointment Reminder - Grandes Ligas Barber`;
        case "contact_notification":
            return `New Message from ${data.name}`;
        case "contact_reply":
            return `Thank you for contacting Grandes Ligas Barber`;
        default:
            return "Grandes Ligas Barber";
    }
}
function buildHtml(data) {
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
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
              ${data.email ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>` : ""}
              ${data.phone ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>` : ""}
              ${data.barber ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Barber:</td><td style="padding: 8px;">${data.barber}</td></tr>` : ""}
              ${data.service ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px;">${data.service}</td></tr>` : ""}
              ${data.date ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Date:</td><td style="padding: 8px;">${data.date}</td></tr>` : ""}
              ${data.time ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Time:</td><td style="padding: 8px;">${data.time}</td></tr>` : ""}
              ${data.notes ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Notes:</td><td style="padding: 8px;">${data.notes}</td></tr>` : ""}
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
            <p style="color: #555; font-size: 16px;">${data.message || `Hi ${data.name}, your appointment has been confirmed.`}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${data.date ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Date:</td><td style="padding: 8px;">${data.date}</td></tr>` : ""}
              ${data.time ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Time:</td><td style="padding: 8px;">${data.time}</td></tr>` : ""}
              ${data.barber ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Barber:</td><td style="padding: 8px;">${data.barber}</td></tr>` : ""}
              ${data.service ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px;">${data.service}</td></tr>` : ""}
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
            <p style="color: #555; font-size: 16px;">${data.message || `Hi ${data.name}, this is a reminder about your upcoming appointment.`}</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
              ${data.date ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Date:</td><td style="padding: 8px;">${data.date}</td></tr>` : ""}
              ${data.time ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Time:</td><td style="padding: 8px;">${data.time}</td></tr>` : ""}
              ${data.barber ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Barber:</td><td style="padding: 8px;">${data.barber}</td></tr>` : ""}
              ${data.service ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Service:</td><td style="padding: 8px;">${data.service}</td></tr>` : ""}
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
              <tr><td style="padding: 8px; font-weight: bold; color: #555;">Name:</td><td style="padding: 8px;">${data.name}</td></tr>
              ${data.email ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;">${data.email}</td></tr>` : ""}
              ${data.phone ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Phone:</td><td style="padding: 8px;">${data.phone}</td></tr>` : ""}
            </table>
            ${data.message ? `<div style="margin-top: 16px; padding: 16px; background: #f5f5f5; border-radius: 8px;"><p style="color: #333; margin: 0;">${data.message}</p></div>` : ""}
          </div>
          ${footer}
        </div>`;
        case "contact_reply":
            return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          ${header}
          <div style="padding: 24px;">
            <h2 style="color: #333;">Thank You for Reaching Out!</h2>
            <p style="color: #555; font-size: 16px;">${data.message || "Thank you for your message. We'll get back to you shortly!"}</p>
            <p style="color: #555;">- The Grandes Ligas Barber Shop Team</p>
          </div>
          ${footer}
        </div>`;
        default:
            return `<p>${data.message || ""}</p>`;
    }
}
function getRecipient(data) {
    switch (data.type) {
        case "shop_notification":
        case "contact_notification":
            return { email: OWNER_EMAIL, name: "Grandes Ligas Barber" };
        case "customer_confirmation":
        case "reminder":
        case "contact_reply":
            if (!data.email)
                throw new https_1.HttpsError("invalid-argument", "Customer email is required");
            return { email: data.email, name: data.name };
        default:
            throw new https_1.HttpsError("invalid-argument", "Invalid email type");
    }
}
exports.sendEmail = (0, https_1.onCall)({ secrets: [brevoApiKey] }, async (request) => {
    const data = request.data;
    if (!data.type || !data.name) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields: type, name");
    }
    const recipient = getRecipient(data);
    const subject = buildSubject(data);
    const htmlContent = buildHtml(data);
    const payload = {
        sender: SENDER,
        to: [recipient],
        subject,
        htmlContent,
    };
    firebase_functions_1.logger.info("Sending email via Brevo", { type: data.type, to: recipient.email });
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
        firebase_functions_1.logger.error("Brevo API error", { status: response.status, body: errorBody });
        throw new https_1.HttpsError("internal", "Failed to send email");
    }
    firebase_functions_1.logger.info("Email sent successfully", { type: data.type, to: recipient.email });
    return { success: true };
});
function formatPhoneForSms(phone) {
    const digits = phone.replace(/\D/g, "");
    if (digits.length === 10)
        return "+1" + digits;
    if (digits.length === 11 && digits.startsWith("1"))
        return "+" + digits;
    return "+" + digits;
}
exports.sendSMS = (0, https_1.onCall)({ secrets: [brevoApiKey] }, async (request) => {
    const data = request.data;
    if (!data.phone || !data.message) {
        throw new https_1.HttpsError("invalid-argument", "Missing required fields: phone, message");
    }
    const recipient = formatPhoneForSms(data.phone);
    const payload = {
        type: "transactional",
        sender: "GrandsLigas",
        recipient,
        content: data.message,
    };
    firebase_functions_1.logger.info("Sending SMS via Brevo", { to: recipient });
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
        firebase_functions_1.logger.error("Brevo SMS error", { status: response.status, body: errorBody });
        throw new https_1.HttpsError("internal", "Failed to send SMS");
    }
    firebase_functions_1.logger.info("SMS sent successfully", { to: recipient });
    return { success: true };
});
//# sourceMappingURL=index.js.map