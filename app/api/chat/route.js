export const runtime = "edge";

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: "API anahtarı bulunamadı" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system:
          "Sen deneyimli, profesyonel bir iş asistanısın. E-posta taslakları yazmak, rapor ve toplantı özetleri oluşturmak, sunum içerikleri hazırlamak, proje planları ve iş stratejileri geliştirmek görevlerindir. Yanıtların her zaman net, yapılandırılmış ve uygulanabilir olsun. Türkçe konuşursun.",
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "API hatası: " + response.status }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.content?.map((b) => b.text || "").join("") || "Boş yanıt";

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
