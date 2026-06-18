'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageBubble } from './MessageBubble';
import { useAssistant } from '@/hooks/use-assistant';
import { useChatStore } from '@/store/chat.store';

interface ChatInterfaceProps {
  userAvatar?: string;
  initialPrompt?: string;
}

export function ChatInterface({ userAvatar, initialPrompt }: ChatInterfaceProps) {
  const t = useTranslations('Assistant');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isPending, error } = useAssistant();
  const allMessages = useChatStore((s) => s.allMessages);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const messages = useMemo(
    () => (allMessages ?? []).filter((m) => m.conversationId === activeConversationId),
    [allMessages, activeConversationId],
  );
  const createConversation = useChatStore((s) => s.createConversation);
  const addUserMessage = useChatStore((s) => s.addUserMessage);
  const addAssistantMessage = useChatStore((s) => s.addAssistantMessage);

  // Handle external prompt injection
  useEffect(() => {
    if (initialPrompt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isPending) return;

    const content = input.trim();
    setInput('');
    setIsTyping(true);

    // Create conversation if needed
    if (!activeConversationId) {
      await createConversation('ASSISTANT');
    }

    try {
      await addUserMessage(content);
      const response = await sendMessage(content);
      const aiContent = response.data?.reply || response.message;
      const isStructured = !!response.data?.action;
      await addAssistantMessage(aiContent, isStructured);
    } catch (err: unknown) {
      console.error(err);
      await addAssistantMessage(error || t('msg_error'), false);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="border-border/50 bg-card flex h-full w-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* Header */}
      <div
        className="relative flex shrink-0 items-center gap-3 overflow-hidden border-b border-white/10 px-6 py-4 shadow-sm"
        style={{
          background:
            'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
        }}
      >
        <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-16 -bottom-8 h-24 w-24 rounded-full bg-white/5" />

        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white shadow-sm ring-1 ring-white/30 backdrop-blur-md">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="relative z-10">
          <h2 className="text-sm font-bold text-white drop-shadow-sm">{t('title')}</h2>
          <p className="text-xs font-medium text-white/80">{t('subtitle')}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-smooth p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="bg-primary/5 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Sparkles className="h-8 w-8 opacity-80" />
            </div>
            <h3 className="text-foreground mb-2 text-lg font-bold">{t('empty_state_title')}</h3>
            <p className="text-muted-foreground max-w-sm text-sm">{t('empty_state_desc')}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} userAvatar={userAvatar} />
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground flex items-center gap-3 py-4 text-sm"
              >
                <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                {t('typing')}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-background/50 border-border/30 shrink-0 border-t p-4 backdrop-blur-md">
        <div className="border-border/50 bg-background focus-within:border-primary/50 focus-within:ring-primary/20 relative flex items-end gap-2 rounded-2xl border p-2 shadow-sm transition-all focus-within:ring-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={t('input_placeholder')}
            className="text-foreground placeholder:text-muted-foreground max-h-[150px] min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm outline-none"
            rows={1}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={{ fieldSizing: 'content' } as any}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mr-1 mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-all hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-muted-foreground/70 mt-2 text-center text-[10px] font-medium">
          Karsa AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}
