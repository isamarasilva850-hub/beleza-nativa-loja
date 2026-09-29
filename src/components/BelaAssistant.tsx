"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bela";
  type?: "guide" | "message" | "generic";
}

const BelaAvatar = () => (
  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    {/* Background circle */}
    <circle cx="50" cy="50" r="50" fill="#7BC9C2" />

    {/* Face */}
    <circle cx="50" cy="45" r="25" fill="#FFE4E1" />

    {/* Hair */}
    <path d="M 25 45 Q 25 20 50 20 Q 75 20 75 45" fill="#8B4513" />

    {/* Eyes */}
    <circle cx="40" cy="40" r="3" fill="#333" />
    <circle cx="60" cy="40" r="3" fill="#333" />

    {/* Smile */}
    <path d="M 40 50 Q 50 55 60 50" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round" />

    {/* Sparkle effect */}
    <circle cx="30" cy="25" r="2" fill="#FFD700" opacity="0.8" />
    <circle cx="70" cy="30" r="2" fill="#FFD700" opacity="0.8" />
  </svg>
);

export default function BelaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Oi! Sou a Bela, sua assistente de IA. Como posso te ajudar? 😊",
      sender: "bela",
      type: "generic"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user"
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/bela/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      if (response.ok) {
        const data = await response.json();
        const belaMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: "bela",
          type: data.type
        };
        setMessages((prev) => [...prev, belaMessage]);
      }
    } catch (err) {
      console.error("Erro:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "❌ Oops, algo deu errado. Tente de novo!",
          sender: "bela"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-40 border-2 border-white overflow-hidden"
        title="Abrir Bela"
        style={{position: 'fixed', bottom: '24px', left: '24px', width: '64px', height: '64px', zIndex: 40}}
      >
        <div className="w-full h-full" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <BelaAvatar />
        </div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7BC9C2] to-[#5fb3ac] text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden">
            <BelaAvatar />
          </div>
          <div>
            <h3 className="font-bold text-lg">Bela</h3>
            <p className="text-xs opacity-90">Sua assistente de IA</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:opacity-80 text-xl"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-lg ${
                msg.sender === "user"
                  ? "bg-[#7BC9C2] text-white rounded-br-none"
                  : "bg-white border border-gray-300 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.sender === "bela" && msg.type === "message" && (
                <button
                  onClick={() => {
                    const textToCopy = msg.text
                      .replace("💬 **Mensagem sugerida:**\n\n", "")
                      .replace("\n\n[Copiar] [Enviar]", "");
                    navigator.clipboard.writeText(textToCopy);
                    alert("✅ Mensagem copiada!");
                  }}
                  className="text-xs mt-2 text-blue-600 hover:text-blue-800 font-bold"
                >
                  📋 Copiar
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-lg rounded-bl-none">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 flex gap-2 bg-white rounded-b-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && handleSend()}
          placeholder="Pergunte a Bela..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#7BC9C2]"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-[#7BC9C2] hover:bg-[#5fb3ac] disabled:opacity-50 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          📤
        </button>
      </div>

      {/* Quick buttons */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 rounded-b-2xl flex gap-2 flex-wrap text-xs">
        <button
          onClick={() => setInput("Como subo um produto?")}
          className="bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
        >
          📦 Upload
        </button>
        <button
          onClick={() => setInput("Como monto um pedido?")}
          className="bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
        >
          🛒 Pedido
        </button>
        <button
          onClick={() => setInput("Me ajuda com uma mensagem")}
          className="bg-white border border-gray-300 px-2 py-1 rounded hover:bg-gray-100"
        >
          💬 Mensagem
        </button>
      </div>
    </div>
  );
}
