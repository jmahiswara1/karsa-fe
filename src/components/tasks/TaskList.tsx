'use client';

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox, CheckCircle2, CircleDot, Circle, Ban } from 'lucide-react';
import type { Task, TaskStatus } from '@/hooks/use-tasks';

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'priority_desc'
  | 'priority_asc'
  | 'deadline_asc'
  | 'deadline_desc'
  | 'title_asc';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEditTask: (task: Task) => void;
  sort: SortOption;
  systemColumns?: { id: string; name: string }[];
}

const STATUS_GROUPS: {
  status: TaskStatus | 'ORPHAN';
  label: string;
  icon: typeof Circle;
  color: string;
  i18nKey: string;
}[] = [
  {
    status: 'ORPHAN',
    label: 'Inbox',
    icon: Inbox,
    color: 'text-violet-600 dark:text-violet-400',
    i18nKey: 'inbox',
  },
  { status: 'TODO', label: 'To Do', icon: Circle, color: 'text-slate-500', i18nKey: 'status_todo' },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    icon: CircleDot,
    color: 'text-blue-500',
    i18nKey: 'status_in_progress',
  },
  {
    status: 'DONE',
    label: 'Done',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    i18nKey: 'status_done',
  },
  {
    status: 'CANCELLED',
    label: 'Cancelled',
    icon: Ban,
    color: 'text-red-500',
    i18nKey: 'status_cancelled',
  },
];

const PRIORITY_ORDER: Record<string, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

function sortTasks(tasks: Task[], sort: SortOption): Task[] {
  const sorted = [...tasks];
  switch (sort) {
    case 'newest':
      return sorted.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'oldest':
      return sorted.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    case 'priority_desc':
      return sorted.sort(
        (a, b) => (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9),
      );
    case 'priority_asc':
      return sorted.sort(
        (a, b) => (PRIORITY_ORDER[b.priority] ?? 0) - (PRIORITY_ORDER[a.priority] ?? 0),
      );
    case 'deadline_asc':
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    case 'deadline_desc':
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      });
    case 'title_asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

export function TaskList({
  tasks,
  isLoading,
  onEditTask,
  sort,
  systemColumns = [],
}: TaskListProps) {
  const t = useTranslations('Tasks');

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 p-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="border-border/40 bg-card flex items-center gap-4 rounded-2xl border px-5 py-4"
          >
            <Skeleton className="h-5 w-5 rounded-full" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Inbox className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-foreground mb-1 text-base font-semibold">{t('list_empty')}</h3>
        <p className="text-muted-foreground text-sm">{t('list_empty_desc')}</p>
      </div>
    );
  }

  const sortedTasks = sortTasks(tasks, sort);
  const systemColumnIds = new Set(systemColumns.map((c) => c.id));

  // 1. Orphan tasks (no column)
  const orphanTasks = sortedTasks.filter((t) => !t.columnId);

  // 2. System column tasks (grouped by status)
  const systemTasks = sortedTasks.filter((t) => t.columnId && systemColumnIds.has(t.columnId));
  const groupedByStatus = STATUS_GROUPS.filter((g) => g.status !== 'ORPHAN')
    .map((group) => ({
      ...group,
      tasks: systemTasks.filter((t) => t.status === group.status),
    }))
    .filter((g) => g.tasks.length > 0);

  // 3. Custom column tasks (grouped by column)
  const customTasks = sortedTasks.filter((t) => t.columnId && !systemColumnIds.has(t.columnId));
  const customColumnMap = new Map<string, { name: string; tasks: Task[] }>();
  for (const task of customTasks) {
    const col = customColumnMap.get(task.columnId!) || {
      name: task.column?.name ?? 'Unknown',
      tasks: [],
    };
    col.tasks.push(task);
    customColumnMap.set(task.columnId!, col);
  }
  const customGroups = Array.from(customColumnMap.entries()).map(([columnId, { name, tasks }]) => ({
    columnId,
    name,
    tasks,
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Orphan tasks (Inbox) */}
      {orphanTasks.length > 0 && (
        <GroupSection
          label={t('inbox')}
          icon={Inbox}
          color="text-violet-600 dark:text-violet-400"
          count={orphanTasks.length}
          description={t('inbox_desc')}
        >
          {orphanTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </GroupSection>
      )}

      {/* System status groups */}
      {groupedByStatus.map((group) => {
        const Icon = group.icon;
        return (
          <GroupSection
            key={group.status}
            label={t(group.i18nKey as 'status_todo')}
            icon={Icon}
            color={group.color}
            count={group.tasks.length}
          >
            <AnimatePresence initial={false}>
              {group.tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
            </AnimatePresence>
          </GroupSection>
        );
      })}

      {/* Custom column groups */}
      {customGroups.map((group) => (
        <GroupSection
          key={group.columnId}
          label={group.name}
          icon={CircleDot}
          color="text-blue-500"
          count={group.tasks.length}
        >
          <AnimatePresence initial={false}>
            {group.tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </AnimatePresence>
        </GroupSection>
      ))}
    </div>
  );
}

interface GroupSectionProps {
  label: string;
  icon: typeof Circle;
  color: string;
  count: number;
  description?: string;
  children: React.ReactNode;
}

function GroupSection({
  label,
  icon: Icon,
  color,
  count,
  description,
  children,
}: GroupSectionProps) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <h3 className="text-foreground text-sm font-semibold">{label}</h3>
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-medium">
          {count}
        </span>
        {description && <span className="text-muted-foreground text-xs">{description}</span>}
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        className="flex flex-col gap-2"
      >
        {children}
      </motion.div>
    </section>
  );
}
