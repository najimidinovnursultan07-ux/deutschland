function escapeMarkdown(text: string): string {
  return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, "\\$1");
}

export async function sendSuggestionToTelegram(
  email: string,
  text: string
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Telegram credentials are not configured");
  }

  const message = [
    "🔔 *Жаңы сунуш келип түштү\\!*",
    `📧 *Email:* ${escapeMarkdown(email)}`,
    `📝 *Сунуш:* ${escapeMarkdown(text)}`,
  ].join("\n");

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "MarkdownV2",
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Telegram API error: ${response.status} ${detail}`);
  }
}
