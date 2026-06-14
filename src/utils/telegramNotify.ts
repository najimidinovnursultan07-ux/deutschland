/**
 * Server-only Telegram alerts. Never use NEXT_PUBLIC_* for bot tokens.
 * Configure: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 */

export function escapeTelegramMarkdown(text: string): string {
  return text.replace(/([_*\[\]`])/g, "\\$1");
}

export async function sendTelegramAlert(message: string): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken?.trim() || !chatId?.trim()) {
    return false;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Telegram alert failed:", response.status, detail);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Telegram alert failed:", error);
    return false;
  }
}

/** Fire-and-forget — does not block API responses */
export function sendTelegramAlertAsync(message: string): void {
  void sendTelegramAlert(message);
}
