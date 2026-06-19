'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles, User, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { Message } from '@/components/assistant/MessageBubble';
import { useAssistant } from '@/hooks/use-assistant';
import { useChatStore } from '@/store/chat.store';
import { useDialogStore } from '@/store/dialog.store';

interface MiniChatProps {
  userAvatar?: string;
}

function MiniMessageBubble({ message, userAvatar }: { message: Message; userAvatar?: string }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('flex w-full gap-2.5 py-1.5', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div className="mt-0.5 shrink-0">
        {isUser ? (
          <div className="h-7 w-7 overflow-hidden rounded-full shadow-sm ring-2 ring-white/30">
            {userAvatar ? (
              <Image src={userAvatar} alt="User" width={28} height={28} className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/20">
                <User className="h-3.5 w-3.5 text-white/80" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white shadow-sm ring-1 ring-white/30">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed shadow-sm',
          isUser
            ? 'rounded-tr-sm bg-white/90 text-slate-800'
            : 'rounded-tl-sm border border-white/10 bg-white/10 text-white/95 backdrop-blur-sm',
        )}
      >
        {message.isStructured ? (
          <div className="flex flex-col gap-3">
            <div
              className={cn(
                'prose prose-sm prose-p:leading-relaxed max-w-none',
                isUser
                  ? 'prose-p:text-slate-800 prose-strong:text-slate-800'
                  : 'prose-invert prose-pre:bg-black/20',
              )}
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'prose prose-sm prose-p:leading-relaxed max-w-none',
              isUser
                ? 'prose-p:text-slate-800 prose-strong:text-slate-800'
                : 'prose-invert prose-pre:bg-black/20 prose-p:text-white/95',
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function MiniChat({ userAvatar }: MiniChatProps) {
  const t = useTranslations('Dashboard');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isPending, error } = useAssistant();

  const storeAllMessages = useChatStore((s) => s.allMessages);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const messages = useMemo(
    () => (storeAllMessages ?? []).filter((m) => m.conversationId === activeConversationId),
    [storeAllMessages, activeConversationId],
  );
  const createConversation = useChatStore((s) => s.createConversation);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const addAssistantMessage = useChatStore((s) => s.addAssistantMessage);
  const clearChat = useChatStore((s) => s.clearChat);
  const { showConfirm } = useDialogStore();

  const handleClear = () => {
    showConfirm({
      title: 'Clear chat',
      description: 'Are you sure you want to clear this chat? This cannot be undone.',
      confirmText: 'Clear',
      cancelText: 'Cancel',
      isDestructive: true,
      onConfirm: () => clearChat(),
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const content = input.trim();
    setInput('');
    setIsTyping(true);

    // Create conversation if needed
    if (!activeConversationId) {
      await createConversation('MINI');
    }

    try {
      await addUserMessage(content);
      const response = await sendMessage(content);
      const aiContent = response.reply || 'Maaf, saya tidak bisa memproses permintaan Anda.';
      const isStructured = !!response.action;
      await addAssistantMessage(aiContent, isStructured);
    } catch (err: unknown) {
      console.error(err);
      await addAssistantMessage(error || 'An error occurred', false);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col px-6 pb-5">
      {/* Clear button */}
      {messages.length > 0 && (
        <div className="mb-2 flex justify-end">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-white/60 transition-all hover:bg-white/10 hover:text-white/90"
          >
            <Trash2 className="h-3 w-3" />
            Clear chat
          </button>
        </div>
      )}
      {/* Messages Area */}
      <div ref={scrollRef} className="overflow-y-auto scroll-smooth" style={{ maxHeight: '260px' }}>
        {messages.length === 0 ? (
          <div className="flex h-16 items-center justify-center">
            <p className="text-center text-[13px] text-white/50">{t('quick_chat_placeholder')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MiniMessageBubble key={msg.id} message={msg} userAvatar={userAvatar} />
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 py-2.5"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-3 w-3 animate-pulse text-white/80" />
                </div>
                <span className="text-xs font-medium text-white/60">{t('quick_chat_typing')}</span>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-3.5 py-2.5 shadow-sm transition-all focus-within:border-white/25 focus-within:bg-white/15">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder={t('quick_chat_placeholder')}
          className="flex-1 bg-transparent text-[13px] text-white/95 outline-none placeholder:text-white/40"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isPending}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/90 text-slate-700 shadow-sm transition-all hover:scale-105 hover:bg-white active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="mt-1.5 text-center text-[10px] font-medium text-white/40">
        Karsa AI can make mistakes.
      </p>
    </div>
  );
}
