import { Injectable } from "@nestjs/common";
import { Resend } from "resend";

@Injectable()
export class NotificationsService {
  private resend: Resend | null;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.resend = apiKey ? new Resend(apiKey) : null;
  }

  async notifyNewLead(lead: {
    name: string;
    phone: string;
    email?: string | null;
    city?: string | null;
    leadPlans?: Array<{
      plan: { name: string; slug: string };
    }>;
  }) {
    if (!this.resend) {
      console.log("[Notifications] Resend not configured, skipping email");
      return;
    }

    const notificationEmail = process.env.NOTIFICATION_EMAIL;
    if (!notificationEmail) return;

    const planNames =
      lead.leadPlans?.map((lp) => lp.plan.name).join(", ") || "N/A";

    await this.resend.emails.send({
      from: "SeguroSimples <leads@segurosimples.com.br>",
      to: notificationEmail,
      subject: `Novo Lead: ${lead.name}`,
      html: `
        <h2>Novo lead qualificado pela Clara!</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Nome</td><td style="padding:8px;border:1px solid #ddd">${lead.name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Telefone</td><td style="padding:8px;border:1px solid #ddd">${lead.phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${lead.email || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Cidade</td><td style="padding:8px;border:1px solid #ddd">${lead.city || "-"}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Planos Recomendados</td><td style="padding:8px;border:1px solid #ddd">${planNames}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666">Entre em contato em ate 24h.</p>
      `,
    });
  }
}
