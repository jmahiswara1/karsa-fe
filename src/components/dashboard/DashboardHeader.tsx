'use client';

import { CheckCircle2, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageBanner } from '@/components/shared/PageBanner';
import { MiniChat } from './MiniChat';
import { useMiniChatExpansion } from '@/hooks/use-mini-chat-expansion';

interface DashboardHeaderProps {
  user: { name?: string; email: string; avatarUrl?: string } | null;
  subtitle: string;
  doneTasks: number;
  totalTasks: number;
}

export function DashboardHeader({ user, subtitle, doneTasks, totalTasks }: DashboardHeaderProps) {
  const { isExpanded, toggle } = useMiniChatExpansion();

  const rightSlot = (
    <div className="flex items-center gap-2">
      <div className="flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/15 px-4 text-sm font-medium text-white/90 backdrop-blur-sm">
        <CheckCircle2 className="h-4 w-4" />
        {doneTasks}/{totalTasks} done today
      </div>
      <button
        onClick={toggle}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/15 text-white/90 backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/25 active:scale-95"
        aria-label={isExpanded ? 'Collapse chat' : 'Expand chat'}
      >
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
    </div>
  );

  const bottomSlot = (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? 'auto' : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="overflow-hidden"
    >
      <MiniChat userAvatar={user?.avatarUrl} />
    </motion.div>
  );

  return (
    <PageBanner user={user} subtitle={subtitle} rightSlot={rightSlot} bottomSlot={bottomSlot} />
  );
}
