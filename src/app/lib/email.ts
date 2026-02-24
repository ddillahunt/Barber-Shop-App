import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

type EmailType = "shop_notification" | "customer_confirmation" | "reminder" | "contact_notification" | "contact_reply";

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
}

const sendEmailFn = httpsCallable(functions, "sendEmail");
const sendSmsFn = httpsCallable(functions, "sendSMS");

export async function sendEmail(type: EmailType, params: EmailParams): Promise<void> {
  await sendEmailFn({ type, ...params });
}

export async function sendSMS(phone: string, message: string): Promise<void> {
  await sendSmsFn({ phone, message });
}
