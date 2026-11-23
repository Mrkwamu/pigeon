import { createTransporter } from "./mail.transporter.js";
import type { SMTPConfig } from "./mail.types.js";

type MailTransporter = ReturnType<typeof createTransporter>;

class TransporterManager {
  private transporters = new Map<string, MailTransporter>();

  getTransporter(accountId: string, smtp: SMTPConfig): MailTransporter {
    const existing = this.transporters.get(accountId);

    if (existing) {
      return existing;
    }

    const transporter = createTransporter(smtp);

    this.transporters.set(accountId, transporter);

    return transporter;
  }

  closeTransporter(accountId: string): void {
    const transporter = this.transporters.get(accountId);

    if (!transporter) return;

    transporter.close();
    this.transporters.delete(accountId);
  }

  closeAll(): void {
    for (const transporter of this.transporters.values()) {
      transporter.close();
    }

    this.transporters.clear();
  }
}

const transporterManager = new TransporterManager();

export default transporterManager;
