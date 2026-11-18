import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw, Send, Trash2 } from 'lucide-react';
import { api, errorMessage } from '../../lib/api';
import { useAdmin } from '../AdminApp';
import { Badge, Empty, ErrorBanner, PageHeader, Spinner, btn, fmtDateTime, fmtNum, inputCls, useApi, useInterval } from '../ui';

interface Conversation {
  id: string;
  status: 'open' | 'closed';
  unread: number;
  createdAt: string;
  lastMessageAt: string;
  lastText: string | null;
  messageCount: number;
}

interface Message {
  id: number;
  sender: 'visitor' | 'admin' | 'bot';
  text: string;
  createdAt: string;
}

const SENDER: Record<Message['sender'], string> = {
  visitor: 'ভিজিটর',
  admin: 'সাপোর্ট টিম',
  bot: 'স্বয়ংক্রিয় উত্তর',
};

export function ChatsPage() {
  const { refreshCounts } = useAdmin();
  const [filter, setFilter] = useState<'open' | 'closed' | 'all'>('open');
  const [activeId, setActiveId] = useState<string | null>(null);
  const list = useApi<{ items: Conversation[] }>(`/admin/chats?status=${filter}`);
  useInterval(() => list.reload(true), 10_000);

  const active = list.data?.items.find((c) => c.id === activeId) ?? null;

  return (
    <>
      <PageHeader title="চ্যাট" subtitle="ওয়েবসাইটের চ্যাট উইজেট থেকে আসা মেসেজ — এখান থেকে উত্তর দিলে ভিজিটর সাথে সাথে দেখতে পাবেন" />
      <ErrorBanner message={list.error} onRetry={() => list.reload()} />

      <div className="grid min-h-[520px] overflow-hidden rounded-2xl border border-[#0B192C]/10 bg-white md:grid-cols-[300px_1fr]">
        {/* Conversation list */}
        <div className={`border-[#0B192C]/10 md:border-r ${activeId ? 'hidden md:block' : ''}`}>
          <div className="flex gap-1 border-b border-[#0B192C]/10 p-2">
            {(
              [
                ['open', 'চলমান'],
                ['closed', 'সমাধান হয়েছে'],
                ['all', 'সব'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                aria-pressed={filter === k}
                className={`flex-1 rounded-lg px-2 py-1.5 text-[11px] font-bold ${
                  filter === k ? 'bg-[#0B192C] text-white' : 'text-[#0B192C]/70 hover:bg-[#FAF9F5]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {list.loading && !list.data ? (
            <Spinner />
          ) : !list.data?.items.length ? (
            <Empty>কোনো কথোপকথন নেই</Empty>
          ) : (
            <ul className="max-h-[600px] overflow-y-auto">
              {list.data.items.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setActiveId(c.id)}
                    className={`w-full border-b border-[#0B192C]/5 px-3 py-3 text-left text-xs hover:bg-[#FAF9F5] ${
                      c.id === activeId ? 'bg-[#ECFDF5]/60' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#0B192C]">ভিজিটর #{c.id.slice(0, 6)}</span>
                      <span className="text-[10px] font-semibold text-[#0B192C]/50">{fmtDateTime(c.lastMessageAt)}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <span className="truncate font-medium text-[#0B192C]/70">{c.lastText}</span>
                      {c.unread > 0 && (
                        <span className="shrink-0 rounded-full bg-[#D97706] px-1.5 py-0.5 text-[10px] font-bold text-white">
                          {fmtNum(c.unread)} নতুন
                        </span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Thread */}
        <div className={activeId ? '' : 'hidden md:block'}>
          {active ? (
            <Thread
              key={active.id}
              conversation={active}
              onBack={() => setActiveId(null)}
              onChanged={(deleted) => {
                if (deleted) setActiveId(null);
                list.reload(true);
                refreshCounts();
              }}
            />
          ) : (
            <Empty>বাঁ দিক থেকে একটি কথোপকথন বেছে নিন</Empty>
          )}
        </div>
      </div>
    </>
  );
}

function Thread({
  conversation,
  onBack,
  onChanged,
}: {
  conversation: Conversation;
  onBack: () => void;
  onChanged: (deleted?: boolean) => void;
}) {
  const thread = useApi<{ messages: Message[] }>(`/admin/chats/${conversation.id}`);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Opening the thread marks it read on the server.
  useEffect(() => {
    if (thread.data) onChanged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!thread.data]);
  useInterval(() => thread.reload(true), 5_000);
  useEffect(() => {
    // Braces matter: newer Chromium returns a Promise from scrollIntoView, which
    // React would otherwise treat as an effect cleanup and crash on.
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [thread.data?.messages.length]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setBusy('send');
    setError(null);
    try {
      const { message } = await api<{ message: Message }>(`/admin/chats/${conversation.id}/messages`, {
        method: 'POST',
        body: { text: body },
      });
      setText('');
      thread.setData((d) => (d ? { messages: [...d.messages, message] } : d));
      onChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const setStatus = async (status: 'open' | 'closed') => {
    setBusy('status');
    try {
      await api(`/admin/chats/${conversation.id}`, { method: 'PATCH', body: { status } });
      onChanged();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    if (!window.confirm('এই কথোপকথনটি স্থায়ীভাবে মুছে ফেলবেন?')) return;
    setBusy('delete');
    try {
      await api(`/admin/chats/${conversation.id}`, { method: 'DELETE' });
      onChanged(true);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(null);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#0B192C]/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="rounded-md p-1 md:hidden" aria-label="ফিরে যান">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-bold">ভিজিটর #{conversation.id.slice(0, 6)}</span>
          {conversation.status === 'closed' ? <Badge tone="green">সমাধান হয়েছে</Badge> : <Badge tone="blue">চলমান</Badge>}
        </div>
        <div className="flex gap-2">
          {conversation.status === 'open' ? (
            <button className={btn.secondary} onClick={() => setStatus('closed')} disabled={!!busy}>
              <CheckCircle2 className="h-3.5 w-3.5" /> সমাধান হয়েছে
            </button>
          ) : (
            <button className={btn.secondary} onClick={() => setStatus('open')} disabled={!!busy}>
              <RotateCcw className="h-3.5 w-3.5" /> আবার খুলুন
            </button>
          )}
          <button className={btn.danger} onClick={remove} disabled={!!busy} aria-label="মুছুন">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-[440px] min-h-[300px] flex-1 space-y-3 overflow-y-auto bg-[#FAF9F5] p-4 text-xs">
        {thread.loading && !thread.data ? (
          <Spinner />
        ) : (
          thread.data?.messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender === 'visitor' ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[80%] whitespace-pre-wrap rounded-2xl p-3 font-medium leading-relaxed ${
                  m.sender === 'visitor'
                    ? 'rounded-bl-xs border border-[#0B192C]/10 bg-white text-[#0B192C]'
                    : m.sender === 'admin'
                    ? 'rounded-br-xs bg-[#064E3B] text-white'
                    : 'rounded-br-xs border border-dashed border-[#0B192C]/20 bg-white text-[#0B192C]/70'
                }`}
              >
                {m.text}
              </div>
              <span className="mt-1 px-1 text-[10px] font-semibold text-[#0B192C]/50">
                {SENDER[m.sender]} • {fmtDateTime(m.createdAt)}
              </span>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      {(error || thread.error) && <p role="alert" className="px-4 pt-2 text-xs font-semibold text-[#831843]">{error ?? thread.error}</p>}
      <form onSubmit={send} className="flex items-center gap-2 border-t border-[#0B192C]/10 p-3">
        <input
          className={inputCls}
          placeholder="উত্তর লিখুন…"
          maxLength={2000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className={btn.primary} disabled={busy === 'send' || !text.trim()}>
          {busy === 'send' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          পাঠান
        </button>
      </form>
    </div>
  );
}
