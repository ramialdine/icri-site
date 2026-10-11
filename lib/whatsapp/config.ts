import { sanityWriteClient } from "@/sanity/lib/writeClient";

/** WhatsApp sends numbers as bare digits ("14015551234"); env lists may include "+", spaces or dashes. */
export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function getBotConfig() {
  const approver = normalizePhone(process.env.WHATSAPP_APPROVER ?? "");
  const allowedSenders = new Set(
    (process.env.WHATSAPP_ALLOWED_SENDERS ?? "")
      .split(",")
      .map(normalizePhone)
      .filter(Boolean)
  );
  if (approver) {
    allowedSenders.add(approver);
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (productionHost ? `https://${productionHost}` : "")).replace(
    /\/$/,
    ""
  );

  return { approver, allowedSenders, siteUrl };
}

/** Names of the settings the bot still needs before it can handle messages. */
export function missingBotSettings(): string[] {
  const required = [
    "WHATSAPP_APP_SECRET",
    "WHATSAPP_TOKEN",
    "WHATSAPP_PHONE_NUMBER_ID",
    "WHATSAPP_APPROVER",
    "ANTHROPIC_API_KEY",
  ];
  const missing = required.filter((name) => !process.env[name]);
  if (!sanityWriteClient) {
    missing.push("SANITY_API_WRITE_TOKEN");
  }
  return missing;
}
