import {
  escapeTelegramMarkdown,
  sendTelegramAlert,
  sendTelegramAlertAsync,
} from "@/utils/telegramNotify";

function md(value: string): string {
  return escapeTelegramMarkdown(value);
}

export function notifyUserRegistered(input: {
  name: string;
  email: string;
  targetLanguage: string;
}): void {
  sendTelegramAlertAsync(
    [
      "🆕 *New user registered*",
      `👤 *Name:* ${md(input.name)}`,
      `📧 *Email:* ${md(input.email)}`,
      `🎯 *Language:* ${md(input.targetLanguage)}`,
      `🕐 ${md(new Date().toISOString())}`,
    ].join("\n")
  );
}

export function notifyUserLogin(input: { name: string; email: string }): void {
  sendTelegramAlertAsync(
    [
      "✅ *User login*",
      `👤 *Name:* ${md(input.name)}`,
      `📧 *Email:* ${md(input.email)}`,
      `🕐 ${md(new Date().toISOString())}`,
    ].join("\n")
  );
}

export function notifyUserLogout(email: string): void {
  sendTelegramAlertAsync(
    [
      "🚪 *User logout*",
      `📧 *Email:* ${md(email)}`,
      `🕐 ${md(new Date().toISOString())}`,
    ].join("\n")
  );
}

export function notifyFailedLogin(email: string): void {
  sendTelegramAlertAsync(
    [
      "⚠️ *Failed login attempt*",
      `📧 *Email:* ${md(email)}`,
      `🕐 ${md(new Date().toISOString())}`,
    ].join("\n")
  );
}

/** User suggestion — awaited so the API can surface delivery errors */
export async function sendSuggestionToTelegram(
  email: string,
  text: string
): Promise<void> {
  const message = [
    "🔔 *New suggestion*",
    `📧 *Email:* ${md(email)}`,
    `📝 *Message:* ${md(text)}`,
    `🕐 ${md(new Date().toISOString())}`,
  ].join("\n");

  const sent = await sendTelegramAlert(message);
  if (!sent) {
    throw new Error("Telegram credentials are not configured or delivery failed");
  }
}

export async function sendFeedbackToTelegram(
  email: string,
  text: string
): Promise<void> {
  const message = [
    "💬 *ЖАҢЫ ОТЗЫВ КЕЛДИ!*",
    `📧 *Email:* ${md(email)}`,
    `📝 *Отзыв:* ${md(text)}`,
    `🕐 ${md(new Date().toISOString())}`,
  ].join("\n");

  const sent = await sendTelegramAlert(message);
  if (!sent) {
    throw new Error("Telegram credentials are not configured or delivery failed");
  }
}
