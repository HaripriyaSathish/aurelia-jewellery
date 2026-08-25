import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareText, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { chatbotService } from '../services/api';

const QUICK_ACTIONS = ['See current offers', 'Track my order', 'Talk on WhatsApp'];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I'm the VETRI assistant. Ask me about current offers, track an order, or anything about our jewellery.",
    },
  ]);
  const [input, setInput] = useState('');
  const [context, setContext] = useState({});
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setSending(true);

    const data = await chatbotService.sendMessage(trimmed, context);

    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: data.reply, quickReplies: data.quick_replies || [], whatsappUrl: data.whatsapp_url },
    ]);
    setContext(data.context || {});
    setSending(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-24 left-4 sm:left-6 z-40 w-14 h-14 rounded-full bg-[#1E1C1A] hover:bg-[#B8945A] text-[#E8DDCD] flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-all duration-300 border border-[#B8945A]/50"
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquareText className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-[10.5rem] left-4 sm:left-6 z-40 w-[calc(100vw-2rem)] max-w-sm h-[28rem] bg-[#FFFDF9] border border-[#B8945A]/40 shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">

          {/* Header */}
          <div className="p-4 bg-[#1E1C1A] text-[#FFFDF9] flex items-center gap-2 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-[#B8945A]" />
            <div>
              <p className="text-sm font-serif">VETRI Assistant</p>
              <p className="text-[10px] text-[#E8DDCD]/70 uppercase tracking-wider">Offers · Orders · Products</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-xs whitespace-pre-line leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#1E1C1A] text-white'
                      : 'bg-[#F8F5F0] text-[#1E1C1A] border border-[#E8DDCD]'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.whatsappUrl && (
                  <a
                    href={msg.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-[#25D366] text-white px-3 py-1.5"
                  >
                    <MessageCircle className="w-3 h-3" /> Open WhatsApp
                  </a>
                )}

                {msg.quickReplies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => sendMessage(qr)}
                        className="text-[10px] px-2.5 py-1 border border-[#B8945A]/50 text-[#B8945A] hover:bg-[#B8945A] hover:text-white transition-colors"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sending && (
              <div className="flex items-center gap-1.5 text-[#5C574F] text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8945A] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8945A] animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8945A] animate-pulse [animation-delay:300ms]" />
              </div>
            )}
          </div>

          {/* Quick actions (shown when just opened) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa}
                  onClick={() => sendMessage(qa)}
                  className="text-[10px] px-2.5 py-1 border border-[#B8945A]/50 text-[#B8945A] hover:bg-[#B8945A] hover:text-white transition-colors"
                >
                  {qa}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#E8DDCD] flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about offers, orders..."
              className="flex-1 px-3 py-2 bg-[#F8F5F0] border border-[#E8DDCD] text-xs text-[#1E1C1A] focus:outline-none focus:border-[#B8945A]"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="p-2.5 bg-[#1E1C1A] hover:bg-[#B8945A] text-white transition-colors disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
