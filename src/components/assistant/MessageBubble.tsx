'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Sparkles, User } from 'lucide-react';
import Image from 'next/image';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  userAvatar?: string;
}

export function MessageBubble({ message, userAvatar }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex w-full gap-4 py-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div className="shrink-0">
        {isUser ? (
          <div className="h-8 w-8 overflow-hidden rounded-full ring-1 ring-border shadow-sm">
            {userAvatar ? (
              <Image src={userAvatar} alt="User" width={32} height={32} className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-card border border-border/50 text-foreground rounded-tl-sm'
        )}
      >
        {/* Render text or structured content */}
        {message.isStructured ? (
          <div className="flex flex-col gap-3">
            <p>{message.content}</p>
            {/* Example of structured response area */}
            <div className="rounded-xl bg-muted/50 p-3 border border-border/50">
              <p className="text-xs font-semibold text-muted-foreground mb-2">SUGGESTED ACTIONS</p>
              <div className="flex items-center gap-2 rounded-lg bg-background p-2 border shadow-sm cursor-pointer hover:border-primary/30 transition-colors">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium">Extract 3 tasks</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        )}
      </div>
    </motion.div>
  );
}
