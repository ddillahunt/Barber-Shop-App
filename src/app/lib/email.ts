type EmailType = "shop_notification" | "customer_confirmation" | "appointment_update" | "reminder" | "contact_notification" | "contact_reply";

interface EmailParams {
  name: string;
  email?: string;
  phone?: string;
  barber?: string;
  service?: string;
  date?: string;
  time?: string;
  notes?: string;
  message?: string;
  oldDate?: string;
  oldTime?: string;
  oldBarber?: string;
  oldService?: string;
}

const API_URL = import.meta.env.VITE_NOTIFICATION_API_URL;

async function callApi(action: string, data: Record<string, unknown>): Promise<void> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, data }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }
}

export async function sendEmail(type: EmailType, params: EmailParams): Promise<void> {
  await callApi("sendEmail", { type, ...params });
}

export async function sendSMS(phone: string, message: string): Promise<void> {
  await callApi("sendSMS", { phone, message });
}
