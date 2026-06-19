'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Loader2, Sparkles, User } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTranslations } from 'next-intl';
import { useChatStore } from '@/store/chat.store';
import { EntityCreationCard } from './EntityCreationCard';
import type { MessageWithEntities } from '@/store/chat.store';

export interface Message {
  id: string;
  conversationId?: string;
  role: 'user' | 'assistant';
  content: string;
  isStructured?: boolean;
  createdAt?: string;
  syncStatus?: 'pending' | 'synced' | 'error';
}

interface MessageBubbleProps {
  message: MessageWithEntities;
  userAvatar?: string;
}

export function MessageBubble({ message, userAvatar }: MessageBubbleProps) {
  const t = useTranslations('Assistant');
  const isUser = message.role === 'user';
  const confirmEntity = useChatStore((s) => s.confirmEntity);
  const cancelEntity = useChatStore((s) => s.cancelEntity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('flex w-full gap-4 py-4', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div className="mt-1 shrink-0">
        {isUser ? (
          <div className="ring-background h-8 w-8 overflow-hidden rounded-full shadow-sm ring-2">
            {userAvatar ? (
              <Image src={userAvatar} alt="User" width={32} height={32} className="object-cover" />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <User className="text-muted-foreground h-4 w-4" />
              </div>
            )}
          </div>
        ) : (
          <div className="text-primary ring-border/50 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md ring-1">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-5 py-4 text-sm shadow-sm',
          isUser
            ? 'rounded-tr-sm text-white'
            : 'bg-card border-border/50 text-foreground rounded-tl-sm border',
        )}
        style={
          isUser
            ? {
                background:
                  'linear-gradient(135deg, oklch(0.62 0.22 255) 0%, oklch(0.55 0.24 265) 50%, oklch(0.50 0.22 278) 100%)',
              }
            : undefined
        }
      >
        {/* Render text or structured content */}
        {message.isStructured ? (
          <div className="flex flex-col gap-4">
            <div className="prose prose-sm dark:prose-invert prose-p:leading-relaxed prose-pre:bg-muted/50 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
            {/* Example of structured response area */}
            <div className="bg-primary/5 border-primary/10 rounded-xl border p-4">
              <p className="text-primary mb-3 text-xs font-semibold tracking-wider uppercase">
                Suggested Actions
              </p>
              <div className="bg-background hover:border-primary/40 flex cursor-pointer items-center gap-3 rounded-lg border p-3 shadow-sm transition-all hover:shadow-md">
                <div className="bg-primary/20 text-primary flex h-6 w-6 items-center justify-center rounded-full">
                  <Sparkles className="h-3 w-3" />
                </div>
                <span className="text-sm font-medium">Extract actionable tasks</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'prose prose-sm prose-p:leading-relaxed prose-pre:bg-black/10 prose-pre:text-foreground max-w-none',
              isUser
                ? 'prose-p:text-white prose-strong:text-white text-white'
                : 'dark:prose-invert',
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
          </div>
        )}

        {/* Entity Creation Cards */}
        {message.entities && message.entities.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {message.entities.map((entity, idx) => (
              <EntityCreationCard
                key={`${message.id}-entity-${idx}`}
                entity={entity}
                onConfirm={() => confirmEntity(message.id, idx)}
                onCancel={() => cancelEntity(message.id, idx)}
              />
            ))}
          </div>
        )}

        {/* Sync Status Badge */}
        {isUser && message.syncStatus && (
          <div
            className={cn(
              'mt-2 flex items-center gap-1 text-xs',
              isUser ? 'justify-end' : 'justify-start',
            )}
          >
            {message.syncStatus === 'pending' && (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-white/60" />
                <span className="text-white/60">{t('sync_status_pending')}</span>
              </>
            )}
            {message.syncStatus === 'synced' && (
              <>
                <Check className="h-3 w-3 text-white/60" />
                <span className="text-white/60">{t('sync_status_synced')}</span>
              </>
            )}
            {message.syncStatus === 'error' && (
              <>
                <AlertTriangle className="h-3 w-3 text-white/80" />
                <span className="text-white/80">{t('sync_status_error')}</span>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
