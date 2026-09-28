// Приём заявок с формы «Узнать свободную дату».
// TODO(запуск): отправлять заявку владельцам в Telegram-бот или на contact@verhom.by.
// В демо заявка только пишется в лог сервера.

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

  console.log("[lead]", {
    topic: body.topic,
    name: body.name,
    phone,
    date: body.date,
    guests: body.guests,
    details: body.details,
    note: body.note,
  });

  return Response.json({ ok: true });
}
