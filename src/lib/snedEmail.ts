// src/lib/sendEmail.ts
import { Resend } from "resend";

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, html: string) => {
  return resend.emails.send({
    from: "CourseConnect <noreply@courseconnect.app>",
    to,
    subject,
    html,
  });
};
