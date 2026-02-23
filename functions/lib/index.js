"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAppointmentSMS = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
// Placeholder Cloud Function (SMS removed)
exports.sendAppointmentSMS = (0, https_1.onCall)(async (request) => {
    firebase_functions_1.logger.info("SMS function called but SMS is disabled", { data: request.data });
    return { success: true, message: "SMS disabled" };
});
//# sourceMappingURL=index.js.map