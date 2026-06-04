'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, MessageBubble } from './MessageBubble';

interface ChatInterfaceProps {
  userAvatar?: string;
  initialPrompt?: string;
}

export function ChatInterface({ userAvatar, initialPrompt }: ChatInterfaceProps) {
  const t = useTranslations('Assistant');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Handle external prompt injection
  useEffect(() => {
    if (initialPrompt) {
      setInput(initialPrompt);
    }
  }, [initialPrompt]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      const isTaskExtraction = userMessage.content.toLowerCase().includes('besok') || userMessage.content.toLowerCase().includes('task');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isTaskExtraction 
          ? "I've analyzed your input and found some actionable items. Would you like me to add these to your tasks?"
          : "I understand. I'm here to help you organize your thoughts and prioritize your work. What else is on your mind?",
        isStructured: isTaskExtraction,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-border/50 bg-card/50 px-6 py-4 backdrop-blur-md">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">{t('title')}</h2>
          <p className="text-xs font-medium text-muted-foreground">{t('subtitle')}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary">
              <Sparkles className="h-8 w-8 opacity-80" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{t('empty_state_title')}</h3>
            <p className="max-w-sm text-sm text-muted-foreground">{t('empty_state_desc')}</p>
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
                className="flex items-center gap-3 py-4 text-sm text-muted-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
                {t('typing')}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border/50 bg-background p-2 shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
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
            className="max-h-[150px] min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            rows={1}
            style={{ fieldSizing: 'content' } as any}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="mb-1 mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Karsa AI can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
}
