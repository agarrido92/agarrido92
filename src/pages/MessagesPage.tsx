import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Mail, MessageSquare, ChevronRight, User, X } from 'lucide-react';
import { DirectMessage } from '../types';

export const MessagesPage: React.FC = () => {
  const { messages, currentUser, users, navigateTo } = useApp();

  // Figure 31 Label #1: Search Box
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Group messages into distinct user threads
  const threads = useMemo(() => {
    if (!currentUser) return [];

    const userMsgs = messages.filter(
      m => m.senderId === currentUser.id || m.receiverId === currentUser.id
    );

    const map: Record<string, DirectMessage[]> = {};
    for (const msg of userMsgs) {
      const otherId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
      if (!map[otherId]) map[otherId] = [];
      map[otherId].push(msg);
    }

    return Object.entries(map).map(([otherId, msgs]) => {
      msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const last = msgs[msgs.length - 1];
      const otherUser = users.find(u => u.id === otherId) || {
        id: otherId,
        name: 'ECU User',
        headshot: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        email: 'user@ecu.edu',
        classification: 'Student',
        roles: ['Performer'],
        isAdmin: false,
        location: 'Greenville, NC',
        sites: [],
        about: '',
        availability: 'Available',
        isPrivate: false,
        enrolledDate: '2024-01-01',
        status: 'Active',
        lastActive: 'Recently',
        specialSkills: [],
        firstName: 'ECU',
        lastName: 'User'
      };

      const unreadCount = msgs.filter(m => m.receiverId === currentUser.id && !m.read).length;

      return {
        otherUser,
        lastMessage: last,
        unreadCount,
        allMessages: msgs,
      };
    }).filter(t => {
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        t.otherUser.name.toLowerCase().includes(q) ||
        t.lastMessage.content.toLowerCase().includes(q)
      );
    });
  }, [messages, currentUser, users, searchTerm]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title & New Message Button (Figure 31 Label #2) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Messages</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Direct communication between performers, directors, and production staff.
          </p>
        </div>

        {/* Figure 31 Label #2: + New Message Button */}
        <button
          onClick={() => setIsNewChatModalOpen(true)}
          className="px-4 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Message</span>
        </button>
      </div>

      {/* Figure 31 Label #1: Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search conversations by user or message keyword..."
          className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white ring-theme-primary placeholder-slate-400 shadow-xs"
        />
      </div>

      {/* Figure 31 Label #3: Message List */}
      <div className="space-y-3">
        {threads.length > 0 ? (
          threads.map(t => (
            <div
              key={t.otherUser.id}
              onClick={() => navigateTo('message-detail', t.otherUser.id)}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-between gap-4 group hover:border-[var(--color-primary)]"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="relative flex-shrink-0">
                  <img
                    src={t.otherUser.headshot}
                    alt={t.otherUser.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[var(--color-accent)]"
                  />
                  {/* Figure 31 Label #5: Unread Marker */}
                  {t.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-[var(--color-primary)] transition truncate">
                      {t.otherUser.name}
                    </h2>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {t.otherUser.classification}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                    {t.lastMessage.content}
                  </p>
                </div>
              </div>

              {/* Figure 31 Label #4: Last Message Time */}
              <div className="text-right flex-shrink-0 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  {t.lastMessage.timestamp}
                </span>
                {t.unreadCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold inline-block">
                    {t.unreadCount} New
                  </span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-primary)] transition ml-auto" />
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 dark:text-white">No Messages Found</h3>
            <p className="text-xs text-slate-500 mt-1">Start a conversation with an ECU performer or director.</p>
            <button
              onClick={() => setIsNewChatModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
            >
              Start New Message
            </button>
          </div>
        )}
      </div>

      {/* Start New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 relative">
            <button
              onClick={() => setIsNewChatModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">New Message</h2>
            <p className="text-xs text-slate-500 mb-4">Choose a community member to start a direct message thread.</p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {users.filter(u => u.id !== currentUser?.id).map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setIsNewChatModalOpen(false);
                    navigateTo('message-detail', user.id);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[var(--color-primary)] hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 text-left transition"
                >
                  <img
                    src={user.headshot}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.classification} • {user.roles.join(', ')}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
