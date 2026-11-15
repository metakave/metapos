import React, { useState } from 'react';
import { MessageCircle, X, Send, BookOpen, Sparkles } from 'lucide-react';

interface ChatButtonProps {
  onOpenDemo: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ onOpenDemo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'আসসালামু আলাইকুম! MetaPOS বাংলাদেশে আপনাকে স্বাগতম। আপনি কি অমর একুশে বইমেলার অফলাইন কাউন্টার, বাংলাবাজার প্রেস ইনভেন্টরি নাকি লেখক রয়্যালটি নিয়ে জানতে চান?',
      time: 'এইমাত্র',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = { sender: 'user', text: inputText, time: 'এইমাত্র' };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'ধন্যবাদ মেসেজের জন্য! আমাদের প্রকাশনা টিম সরাসরি আপনার সাথে ফোনে বা অফিসে কথা বলে একটি ফ্রি ডেমো দিতে পারে। আপনি কি একটি ডেমো কল বুক করতে চান?',
          time: 'এইমাত্র',
          hasCta: true,
        },
      ]);
    }, 700);
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
          <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto bg-[#FAF9F5] text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`rounded-2xl p-3 max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#064E3B] text-white rounded-br-xs font-medium'
                      : 'bg-white border border-[#0B192C]/10 text-[#0B192C] shadow-2xs rounded-bl-xs font-medium'
                  }`}
                >
                  <p>{m.text}</p>
                  {(m as any).hasCta && (
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

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-[#0B192C]/10 bg-white flex items-center gap-2">
            <input
              type="text"
              placeholder="বইমেলা কাউন্টার, রয়্যালটি বা দাম সম্পর্কে লিখুন..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 rounded-xl border border-[#0B192C]/20 py-2 px-3 text-xs focus:border-[#064E3B] focus:outline-none"
            />
            <button
              type="submit"
              className="h-8 w-8 rounded-xl bg-[#064E3B] text-white flex items-center justify-center hover:bg-[#043E2F] transition-colors shrink-0"
            >
              <Send className="h-3.5 w-3.5 text-amber-300" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
