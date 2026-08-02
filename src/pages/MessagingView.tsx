import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, Image, MessageSquare, Check, CheckCheck, User, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const MessagingView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { claims, messages, sendMessage } = useData();

  const targetClaimId = searchParams.get('claimId') || claims[0]?.id || '';
  const [activeClaimId, setActiveClaimId] = useState<string>(targetClaimId);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeClaim = claims.find((c) => c.id === activeClaimId);
  const activeMessages = messages.filter((m) => m.claim_id === activeClaimId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeClaimId) return;

    sendMessage(activeClaimId, inputMessage, currentUser?.id || 'user-1');
    setInputMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      
      <div className="glass-panel rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden min-h-[600px] grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Sidebar: Conversations List */}
        <div className="md:col-span-4 border-r border-slate-200/80 dark:border-slate-800 p-4 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
          <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" /> Active Chats
          </h2>

          <div className="space-y-2">
            {claims.map((c) => {
              const lastMsg = messages.filter((m) => m.claim_id === c.id).slice(-1)[0];
              const isSelected = c.id === activeClaimId;

              return (
                <button
                  key={c.id}
                  onClick={() => setActiveClaimId(c.id)}
                  className={`w-full p-3 rounded-2xl text-left border transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-200 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs line-clamp-1">{c.item?.title || 'Item Chat'}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                      {c.status}
                    </span>
                  </div>
                  <p className={`text-[11px] line-clamp-1 mt-1 ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {lastMsg ? lastMsg.message : c.reason}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Chat Thread */}
        <div className="md:col-span-8 flex flex-col justify-between h-[600px] bg-white/80 dark:bg-slate-950/80">
          
          {/* Chat Header */}
          {activeClaim ? (
            <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between glass-panel">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {activeClaim.item?.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Handover Coordinator Chat
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              Select a conversation to start messaging.
            </div>
          )}

          {/* Messages Thread Scroll Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {activeMessages.map((m) => {
              const isMine = m.sender_id === currentUser?.id || m.sender_id === 'user-1';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                      isMine
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs'
                    }`}
                  >
                    <span className="font-bold text-[10px] opacity-80 block">{m.sender_name}</span>
                    <p className="leading-relaxed">{m.message}</p>
                    <div className="flex items-center justify-end gap-1 text-[9px] opacity-70">
                      <span>{new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isMine && <CheckCheck className="w-3 h-3 text-cyan-200" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form Bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200/80 dark:border-slate-800 glass-panel flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type message to arrange campus handover location..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
