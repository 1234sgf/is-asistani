import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Vercel Environment Variables'dan API key'i çekiyoruz
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API anahtarı bulunamadı. Lütfen Vercel panelinden GROQ_API_KEY ekleyin." },
        { status: 500 }
      );
    }

    // Frontend'den gelen mesajları alıyoruz
    const { messages } = await req.json();

    // Groq API'ye istek gönderiyoruz
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // En güçlü ve dengeli modellerden biri
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Groq API tarafında bir hata oluştu." },
        { status: response.status }
      );
    }

    // Başarılı yanıtı döndürüyoruz
    return NextResponse.json(data);

  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { error: "Sunucu tarafında beklenmedik bir hata oluştu." },
      { status: 500 }
    );
  }
}
