"use client";
import { useState, useRef, useEffect } from "react";

const QUICK = [
  { icon: "✉", label: "E-posta taslağı", text: "Profesyonel bir iş e-postası taslağı yazar mısın?" },
  { icon: "📋", label: "Toplantı özeti", text: "Toplantı özeti nasıl oluşturabilirim?" },
  { icon: "📊", label: "Sunum içeriği", text: "Sunum için içerik önerileri ver." },
  { icon: "🗂", label: "Proje planı", text: "Bir proje planı nasıl hazırlanır?" },
  { icon: "📈", label: "SWOT analizi", text: "SWOT analizi nedir ve nasıl yapılır?" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:#07090e;display:flex;align-items:center;justify-content:center;padding:20px;font-family:'DM Sans',sans-serif;color:#e2e8f0}
.app{width:100%;max-width:780px;background:#0a0c10;border:1px solid #1e2433;border-radius:16px;overflow:hidden;display:flex;flex-direction:column;height:92vh;max-height:820px;box-shadow:0 24px 80px rgba(0,0,0,.6)}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 24px;background:#0d1117;border-bottom:1px solid #1e2433;flex-shrink:0}
.logo{display:flex;align-items:center;gap:10px;font-size:15px;font-weight:600;color:#f1f5f9}
.logo-icon{width:30px;height:30px;background:linear-gradient(135deg,#3b82f6,#8b5cf6);border-radius:9px;display:flex;align-items:center;justify-content:center}
.badge{display:flex;align-items:center;gap:6px;font-size:12px;color:#94a3b8;background:#161b27;padding:5px 14px;border-radius:20px;border:1px solid #1e2433}
.dot{width:7px;height:7px;background:#22c55e;border-radius:50%;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.messages{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:18px;scroll-behavior:smooth}
.messages::-webkit-scrollbar{width:4px}
.messages::-webkit-scrollbar-thumb{background:#1e2433;border-radius:4px}
.msg{display:flex;gap:12px;animation:fadeUp .25s ease}
@keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.msg.user{flex-direction:row-reverse}
.avatar{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;flex-shrink:0;margin-top:2px}
.avatar.ai{background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#fff}
.avatar.user{background:#1e2433;color:#94a3b8;font-size:13px}
.msg-body{max-width:80%;display:flex;flex-direction:column}
.msg.user .msg-body{align-items:flex-end}
.bubble{padding:12px 16px;border-radius:12px;font-size:14px;line-height:1.7;white-space:pre-wrap}
.msg.ai .bubble{background:#161b27;border:1px solid #1e2433;color:#cbd5e1;border-top-left-radius:4px}
.msg.user .bubble{background:#1d4ed8;color:#eff6ff;border-top-right-radius:4px}
.ts{font-size:11px;color:#334155;margin-top:5px;font-family:'DM Mono',monospace}
.msg.user .ts{text-align:right}
.typing{display:flex;gap:5px;align-items:center;padding:6px 2px}
.typing span{width:7px;height:7px;background:#475569;border-radius:50%;animation:bounce 1.2s infinite}
.typing span:nth-child(2){animation-delay:.2s}
.typing span:nth-child(3){animation-delay:.4s}
@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-7px)}}
.quick-actions{padding:0 24px 14px;display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0}
.qbtn{background:#161b27;border:1px solid #1e2433;color:#94a3b8;font-family:'DM Sans',sans-serif;font-size:12px;padding:7px 14px;border-radius:20px;cursor:pointer;transition:all .2s}
.qbtn:hover{border-color:#3b82f6;color:#93c5fd;background:#0d1f3c}
.input-area{padding:14px 24px 18px;background:#0d1117;border-top:1px solid #1e2433;display:flex;gap:10px;align-items:flex-end;flex-shrink:0}
.input-wrap{flex:1;background:#161b27;border:1px solid #1e2433;border-radius:12px;display:flex;align-items:flex-end;padding:10px 14px;transition:border-color .2s}
.input-wrap:focus-within{border-color:#3b82f6}
textarea{flex:1;background:transparent;border:none;outline:none;color:#e2e8f0;font-family:'DM Sans',sans-serif;font-size:14px;resize:none;max-height:120px;line-height:1.6}
textarea::placeholder{color:#334155}
.send-btn{width:40px;height:40px;background:#1d4ed8;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;transition:background .2s,transform .1s;flex-shrink:0}
.send-btn:hover{background:#2563eb}
.send-btn:active{transform:scale(.95)}
.send-btn:disabled{background:#1e2433;color:#334155;cursor:default}
`;

export default function Page() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Merhaba! Ben iş asistanınızım. E-posta taslakları, rapor özetleri, sunum içerikleri ve daha fazlası için buradayım. Nasıl yardımcı olabilirim?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const history = useRef([]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function getTime() {
    return new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  function autoResize(e) {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  async function send(text) {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    history.current = [...history.current, { role: "user", content: msg }];
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.current }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      history.current = [...history.current, { role: "assistant", content: data.reply }];
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Hata: " + err.message }]);
    }
    setLoading(false);
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="app">
        <div className="topbar">
          <div className="logo">
            <div className="logo-icon">✦</div>
            İş Asistanı
          </div>
          <div className="badge">
            <div className="dot" />
            Çevrimiçi
          </div>
        </div>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={"msg " + (m.role === "user" ? "user" : "ai")}>
              <div className={"avatar " + (m.role === "user" ? "user" : "ai")}>
                {m.role === "user" ? "S" : "✦"}
              </div>
              <div className="msg-body">
                <div className="bubble">{m.text}</div>
                <div className="ts">{getTime()}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="msg ai">
              <div className="avatar ai">✦</div>
              <div className="msg-body">
                <div className="bubble" style={{ padding: "10px 16px" }}>
                  <div className="typing"><span /><span /><span /></div>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="quick-actions">
          {QUICK.map((q) => (
            <button key={q.label} className="qbtn" onClick={() => send(q.text)}>
              {q.icon} {q.label}
            </button>
          ))}
        </div>

        <div className="input-area">
          <div className="input-wrap">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Mesajınızı yazın... (Enter = gönder, Shift+Enter = yeni satır)"
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(e); }}
              onKeyDown={onKey}
            />
          </div>
          <button className="send-btn" onClick={() => send()} disabled={loading}>➤</button>
        </div>
      </div>
    </>
  );
}
