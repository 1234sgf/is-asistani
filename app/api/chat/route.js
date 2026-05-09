import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API anahtarı bulunamadı. Vercel'den GROQ_API_KEY ekleyip Redeploy yapın." },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Groq tarafında bir hata oluştu." },
        { status: response.status }
      );
    }

    // --- KRİTİK DÜZENLEME BURADA ---
    // Groq'un karmaşık yapısını (choices[0].message.content) temizleyip 
    // sadece "text" olarak frontend'e gönderiyoruz.
    const cleanText = data.choices[0]?.message?.content || "";

    return NextResponse.json({ text: cleanText });
    // -------------------------------

  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: "Sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
