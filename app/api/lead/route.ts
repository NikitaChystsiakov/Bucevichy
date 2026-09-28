// Приём заявок с формы «Узнать свободную дату».
// Куда уходит заявка: в Telegram владельцам, если на сервере заданы LEAD_TELEGRAM_BOT_TOKEN и
// LEAD_TELEGRAM_CHAT_ID (бот от @BotFather, chat_id владельца или группы).
// Без них отправка не настроена (так в демо): заявку никто не получит, поэтому отвечаем
// { ok: false, reason: "not_configured" } — форма просит написать в Viber/Telegram. Статус 200,
// чтобы в консоли браузера не было ошибки запроса.
// TODO(запуск): завести бота и задать переменные; или отправка на contact@verhom.by.

const FIELDS: [key: string, label: string][] = [
  ["name", "Имя"],
  ["phone", "Телефон"],
  ["date", "Дата"],
  ["guests", "Гостей"],
  ["details", "Калькулятор"],
  ["note", "Комментарий"],
];

function leadText(body: Record<string, unknown>, phone: string) {
  const topic = body.topic === "visit" ? "Хотят приехать посмотреть усадьбу" : "Свадьба: узнать свободную дату";
  const lines = FIELDS.map(([key, label]) => {
    const value = key === "phone" ? `+${phone}` : String(body[key] ?? "").trim();
    return value ? `${label}: ${value.slice(0, 500)}` : null;
  }).filter(Boolean);
  return [`Заявка с сайта — ${topic}`, ...lines].join("\n");
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const phone = String(body.phone ?? "").replace(/\D/g, "");
  if (phone.length < 9) {
    return Response.json({ ok: false, error: "phone_required" }, { status: 422 });
  }

  // Как и раньше, заявка пишется в лог сервера
  console.log("[lead]", {
    topic: body.topic,
    name: body.name,
    phone,
    date: body.date,
    guests: body.guests,
    details: body.details,
    note: body.note,
  });

  const token = process.env.LEAD_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.LEAD_TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return Response.json({ ok: false, reason: "not_configured" });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: leadText(body, phone) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`telegram ${res.status}`);
  } catch (e) {
    console.error("[lead] не удалось отправить в Telegram", e);
    return Response.json({ ok: false, reason: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
