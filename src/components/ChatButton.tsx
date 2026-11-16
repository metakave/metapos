import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, BookOpen, Sparkles } from 'lucide-react';
import { api, errorMessage } from '../lib/api';

interface ServerMessage {
  id: number;
  sender: 'visitor' | 'admin' | 'bot';
  text: string;
  createdAt: string;
}

interface ChatMessage {
  id?: number;
  sender: 'user' | 'bot' | 'admin';
  text: string;
  time: string;
  hasCta?: boolean;
  pending?: boolean;
}

const STORAGE_KEY = 'metapos_chat_id';
const POLL_MS = 5000;

const readStoredId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};
const storeId = (id: string | null) => {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable: the chat still works for this page view */
  }
};

const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString('bn-BD', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' });

const fromServer = (m: ServerMessage): ChatMessage => ({
  id: m.id,
  sender: m.sender === 'visitor' ? 'user' : m.sender,
  text: m.text,
  time: timeLabel(m.createdAt),
  hasCta: m.sender === 'bot',
});

interface ChatButtonProps {
  onOpenDemo: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onOpenDemo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! MetaPOS বাংলাদেশে আপনাকে স্বাগতম। আপনি কি অমর একুশে বইমেলার অফলাইন কাউন্টার, বাংলাবাজার প্রেস ইনভেন্টরি নাকি লেখক রয়্যালটি নিয়ে জানতে চান?',
      time: 'এইমাত্র',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const conversationId = useRef<string | null>(readStoredId());
  const lastId = useRef(0);
  const restored = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  const appendFromServer = (incoming: ServerMessage[]) => {
    const fresh = incoming.filter((m) => m.id > lastId.current);
    if (!fresh.length) return;
    lastId.current = fresh[fresh.length - 1].id;
    setMessages((prev) => [...prev.filter((m) => !m.pending), ...fresh.map(fromServer)]);
  };

  // While the panel is open: restore an earlier conversation once, then poll for team replies.
  useEffect(() => {
    if (!isOpen) return;
    let stopped = false;
    const poll = async () => {
      const id = conversationId.current;
      if (!id) return;
      try {
        const { messages } = await api<{ messages: ServerMessage[] }>(`/chat/${id}?after=${lastId.current}`);
        if (!stopped) appendFromServer(messages);
      } catch (err) {
        if ((err as { status?: number }).status === 404) {
          conversationId.current = null; // deleted by the team; start fresh next time
          storeId(null);
        }
      }
    };
    if (!restored.current) {
      restored.current = true;
      poll();
    }
    const timer = setInterval(poll, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    setInputText('');
    setError(null);
    setSending(true);
    setMessages((prev) => [...prev, { sender: 'user', text, time: 'এইমাত্র', pending: true }]);
    try {
      const res = await api<{ conversationId: string; messages: ServerMessage[] }>('/chat', {
        method: 'POST',
        body: { conversationId: conversationId.current, text, afterId: lastId.current },
      });
      conversationId.current = res.conversationId;
      storeId(res.conversationId);
      appendFromServer(res.messages);
    } catch (err) {
      setError(errorMessage(err));
      setInputText(text);
      setMessages((prev) => prev.filter((m) => !m.pending));
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Floating Action Button: Deep Emerald with Warm Amber Ping */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="বাংলা সহায়তা ও চ্যাট"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#064E3B] text-white shadow-xl shadow-[#064E3B]/30 transition-all hover:scale-105 hover:bg-[#043E2F] active:scale-95 border-2 border-white/20"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#D97706]"></span>
            </span>
          </div>
        )}
      </button>

      {/* Floating Chat Drawer Widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl border-2 border-[#0B192C]/15 bg-white shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-200">
          {/* Header in Editorial Navy */}
          <div className="flex items-center justify-between bg-[#0B192C] px-4 py-3.5 text-white">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#064E3B] flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">MetaPOS প্রকাশনা হেল্পডেস্ক</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span>সরাসরি অনলাইন • বাংলা সাপোর্ট টিম</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-300 hover:text-white rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Messages */}
          <div ref={listRef} className="p-4 space-y-3 max-h-[300px] overflow-y-auto bg-[#FAF9F5] text-xs">
            {messages.map((m, idx) => (
              <div
                key={m.id ?? `local-${idx}`}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-2xl p-3 max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#064E3B] text-white rounded-br-xs font-medium'
                      : 'bg-white border border-[#0B192C]/10 text-[#0B192C] shadow-2xs rounded-bl-xs font-medium'
                  }`}
                >
                  {m.sender === 'admin' && (
                    <span className="block text-[10px] font-bold text-[#064E3B] mb-1">MetaPOS সাপোর্ট টিম</span>
                  )}
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  {m.hasCta && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onOpenDemo();
                      }}
                      className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-[#064E3B] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#043E2F]"
                    >
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>ফ্রি ডেমো বুক করুন</span>
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-[#0B192C]/50 mt-1 px-1 font-semibold">{m.time}</span>
              </div>
            ))}
          </div>

          {error && (
            <p role="alert" className="px-3 pt-2 text-[11px] font-semibold text-[#831843] bg-white">
              {error}
            </p>
          )}

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#0B192C]/10 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="বইমেলা কাউন্টার, রয়্যালটি বা দাম সম্পর্কে লিখুন..."
              value={inputText}
              maxLength={1000}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-xl border border-[#0B192C]/20 py-2 px-3 text-xs focus:border-[#064E3B] focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending}
              aria-label="পাঠান"
              className="h-8 w-8 disabled:opacity-60 rounded-xl bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#043E2F] transition-colors shrink-0"
            >
              <Send className="h-3.5 w-3.5 text-amber-300" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
