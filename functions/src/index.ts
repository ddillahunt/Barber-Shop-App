import { onCall } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";

// Placeholder Cloud Function (SMS removed)
export const sendAppointmentSMS = onCall(async (request) => {
  logger.info("SMS function called but SMS is disabled", { data: request.data });
  return { success: true, message: "SMS disabled" };
});
