// src/lib/notify.ts
import { toast } from "sonner";
import { sendEmail } from "./sendEmail";

export const notify = {
  success: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  custom: (msg: string) => toast(msg),

  async email(to: string, subject: string, html: string) {
    try {
      await sendEmail(to, subject, html);
      toast.success("Email sent");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send email");
    }
  },
};
