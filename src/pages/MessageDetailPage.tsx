import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  User as UserIcon,
  ShieldAlert,
  Send,
  ExternalLink,
  CheckCheck
} from 'lucide-react';

export const MessageDetailPage: React.FC<{ otherUserId: string }> = ({ otherUserId }) => {
  const { messages, currentUser, users, sendMessage, navigateTo } = useApp();

  const otherUser = users.find(u => u.id === otherUserId) || users[0];
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useMemo(() => {
    if (!currentUser) return [];
    return messages
      .filter(
        m =>
          (m.senderId === currentUser.id && m.receiverId === otherUser.id) ||
          (m.senderId === otherUser.id && m.receiverId === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, currentUser, otherUser.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage(otherUser.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      {/* Figure 32 Header Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Label #1: Back Button */}
          <button
            onClick={() => navigateTo('messages')}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Back to Messages"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Photo & Sender Name */}
          <div className="flex items-center gap-3">
            <img
              src={otherUser.headshot}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-[var(--color-accent)]"
            />
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                {otherUser.name}
              </h2>
              <span className="text-[11px] text-slate-500">
                {otherUser.classification} • {otherUser.roles.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Label #2 View Profile & Label #3 Report User Buttons */}
        <div className="flex items-center gap-2">
          {/* Label #2: View Profile Button */}
          <button
            onClick={() => navigateTo('profile', otherUser.id)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1 transition"
          >
            <UserIcon className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">View Profile</span>
          </button>

          {/* Label #3: Report User Button */}
          <button
            onClick={() => navigateTo('report-user')}
            className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 flex items-center gap-1 transition"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span className="hidden sm:inline">Report User</span>
          </button>
        </div>
      </div>

      {/* Figure 32 Label #4: Message Content and Time (Thread Body) */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm min-h-[420px] max-h-[520px] flex flex-col justify-between">
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {conversation.length > 0 ? (
            conversation.map(msg => {
              const isMine = msg.senderId === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] sm:max-w-[65%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMine
                        ? 'btn-primary text-white rounded-tr-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-xs text-slate-400">
              No previous messages with {otherUser.name}. Say hello to begin!
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Figure 32 Label #5 & #6: New Message Textbox and Send Button */}
        <form onSubmit={handleSend} className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <input
            type="text"
            required
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400"
          />

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl btn-primary text-xs sm:text-sm font-bold shadow-md flex items-center gap-1.5 transition hover:scale-102 flex-shrink-0"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
