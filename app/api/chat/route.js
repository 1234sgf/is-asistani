export const runtime = "edge";

export async function POST(request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "API anahtarı bulunamadı" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const systemPrompt = "Sen deneyimli, profesyonel bir iş asistanısın. E-posta taslakları yazmak, rapor ve toplantı özetleri oluşturmak, sunum içerikleri hazırlamak, proje planları ve iş stratejileri geliştirmek görevlerindir. Yanıtların her zaman net, yapılandırılmış ve uygulanabilir olsun. Türkçe konuşursun.";

    const geminiMessages = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: geminiMessages,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "API hatası: " + response.status }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Boş yanıt";

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
