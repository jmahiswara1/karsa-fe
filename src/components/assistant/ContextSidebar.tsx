'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  FolderOpen,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat.store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ContextSidebarProps {
  onPromptSelect: (prompt: string) => void;
}

export function ContextSidebar({ onPromptSelect }: ContextSidebarProps) {
  const t = useTranslations('Assistant');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);

  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    renameConversation,
    deleteConversation,
  } = useChatStore();

  const assistantConversations = conversations.filter((c) => c.type === 'ASSISTANT');

  const quickPrompts = [t('prompt_prioritize'), t('prompt_plan'), t('prompt_summary')];

  const contextItems = [
    {
      label: t('context_tasks'),
      value: 11,
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: t('context_overdue'),
      value: 3,
      icon: AlertTriangle,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-900/20',
    },
    {
      label: t('context_projects'),
      value: 2,
      icon: FolderOpen,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
  ];

  const handleRename = async (id: string) => {
    if (editTitle.trim()) {
      await renameConversation(id, editTitle.trim());
      setEditingId(null);
      setEditTitle('');
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteConversationId(id);
    setDeleteModalOpen(true);
    setMenuOpenId(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteConversationId(null);
  };

  const handleDelete = async () => {
    if (deleteConversationId) {
      await deleteConversation(deleteConversationId);
      closeDeleteModal();
    }
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-6 lg:w-[320px]">
      {/* Conversation History */}
      <div className="border-border/50 bg-card rounded-2xl border p-5 shadow-sm">
        <h3 className="text-foreground mb-4 text-sm font-bold">{t('chat_history')}</h3>
        <div className="flex max-h-[300px] flex-col gap-2 overflow-visible">
          {assistantConversations.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t('no_conversations')}
            </p>
          ) : (
            assistantConversations.map((conversation, i) => (
              <motion.div
                key={conversation.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  'group relative flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all',
                  conversation.id === activeConversationId
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-border/40 bg-background hover:border-primary/30 hover:shadow-sm',
                )}
              >
                {editingId === conversation.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRename(conversation.id);
                      if (e.key === 'Escape') {
                        setEditingId(null);
                        setEditTitle('');
                      }
                    }}
                    onBlur={() => handleRename(conversation.id)}
                    className="text-foreground flex-1 bg-transparent text-sm font-medium outline-none"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={() => setActiveConversation(conversation.id)}
                    className="flex-1 text-left"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground line-clamp-1 font-medium transition-colors">
                      {conversation.title}
                    </span>
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === conversation.id ? null : conversation.id)
                    }
                    className="hover:bg-border/50 ml-2 flex h-6 w-6 items-center justify-center rounded-md opacity-0 transition-all group-hover:opacity-100"
                  >
                    <MoreVertical className="text-muted-foreground h-3.5 w-3.5" />
                  </button>

                  {menuOpenId === conversation.id && (
                    <div
                      className="border-border/50 bg-card absolute right-0 z-50 mt-1 w-32 rounded-lg border shadow-lg"
                      style={{ top: '100%' }}
                    >
                      <button
                        onClick={() => {
                          setEditingId(conversation.id);
                          setEditTitle(conversation.title);
                          setMenuOpenId(null);
                        }}
                        className="hover:bg-border/30 flex w-full items-center gap-2 rounded-t-lg px-3 py-2 text-sm transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        {t('rename')}
                      </button>
                      <button
                        onClick={() => openDeleteModal(conversation.id)}
                        className="flex w-full items-center gap-2 rounded-b-lg px-3 py-2 text-sm text-rose-500 transition-colors hover:bg-rose-50 dark:hover:bg-rose-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t('delete')}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      {/* Quick Prompts */}
      <div className="border-border/50 bg-card rounded-2xl border p-5 shadow-sm">
        <h3 className="text-foreground mb-4 text-sm font-bold">{t('quick_prompts_title')}</h3>
        <div className="flex flex-col gap-2">
          {quickPrompts.map((prompt, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onPromptSelect(prompt)}
              className="group border-border/40 bg-background hover:border-primary/30 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-all hover:shadow-sm"
            >
              <span className="text-muted-foreground group-hover:text-foreground font-medium transition-colors">
                {prompt}
              </span>
              <ChevronRight className="text-muted-foreground/50 group-hover:text-primary h-4 w-4 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Context Awareness */}
      <div className="border-border/50 bg-card rounded-2xl border p-5 shadow-sm">
        <h3 className="text-foreground mb-4 text-sm font-bold">Workspace Context</h3>
        <div className="flex flex-col gap-3">
          {contextItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn('flex h-8 w-8 items-center justify-center rounded-lg', item.bg)}
                  >
                    <Icon className={cn('h-4 w-4', item.color)} />
                  </div>
                  <span className="text-muted-foreground text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-foreground text-sm font-bold">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteModalOpen} onOpenChange={closeDeleteModal}>
        <AlertDialogContent className="border-gray-100 p-6 shadow-xl sm:rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
              {t('delete_confirm_title')}
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-1 text-[15px] leading-relaxed text-gray-600">
              {t('delete_confirm_message')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-2 sm:gap-3">
            <AlertDialogCancel
              onClick={closeDeleteModal}
              className="h-auto rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              {t('cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="h-auto rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all hover:bg-red-700"
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
