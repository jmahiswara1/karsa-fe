'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Droppable } from '@hello-pangea/dnd';
import { TaskBoardCard } from './TaskBoardCard';
import { Plus, MoreHorizontal, ArrowRightToLine, Inbox, X, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/hooks/use-tasks';
import { useCreateTask } from '@/hooks/use-tasks';
import { useBoardColors, INBOX_COLOR_KEY } from '@/hooks/use-board-colors';
import { getBoardColorPreset, BOARD_COLOR_PRESETS, type BoardColor } from './board-colors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

export const INBOX_DROPPABLE_ID = 'INBOX';

interface InboxColumnProps {
  tasks: Task[];
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export function InboxColumn({ tasks, onAddTask, onEditTask }: InboxColumnProps) {
  const t = useTranslations('Tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const createTask = useCreateTask();
  const { getColor, setColor } = useBoardColors();

  const preset = getBoardColorPreset(getColor(INBOX_COLOR_KEY));

  const handleQuickAdd = async () => {
    if (!newTaskTitle.trim()) {
      setIsAdding(false);
      return;
    }

    createTask.mutate(
      {
        title: newTaskTitle,
      },
      {
        onSuccess: () => {
          setNewTaskTitle('');
        },
      },
    );
  };

  const handleColorChange = (color: BoardColor) => {
    setColor(INBOX_COLOR_KEY, color);
  };

  if (isCollapsed) {
    return (
      <Droppable droppableId={INBOX_DROPPABLE_ID}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            onClick={() => setIsCollapsed(false)}
            className={cn(
              'border flex h-full w-14 shrink-0 flex-col items-center rounded-xl overflow-hidden shadow-sm transition-all duration-300 py-3 cursor-pointer',
              preset.container,
              snapshot.isDraggingOver ? cn(preset.placeholder, 'ring-2 ring-primary/20') : '',
            )}
          >
            <button
              className={cn('p-1.5 mb-3 rounded-md transition-colors', preset.accent)}
              title={t('inbox_expand')}
            >
              <ArrowRightToLine className="h-4 w-4" />
            </button>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {t('inbox')}
                <span
                  className={cn(
                    'flex min-w-[1.25rem] items-center justify-center rounded-full px-1 py-1 text-[10px] font-bold rotate-90',
                    preset.badge,
                  )}
                >
                  {tasks.length}
                </span>
              </div>
            </div>
            <div className="hidden">{provided.placeholder}</div>
          </div>
        )}
      </Droppable>
    );
  }

  return (
    <div
      className={cn(
        'border flex h-full w-80 shrink-0 flex-col rounded-xl overflow-hidden shadow-sm transition-all duration-300',
        preset.container,
      )}
    >
      {/* Column Header */}
      <div
        className={cn(
          'flex items-center justify-between px-3.5 py-3 border-b',
          preset.header,
        )}
      >
        <h3
          className={cn(
            'text-sm font-semibold tracking-tight flex items-center gap-2',
            preset.accent,
          )}
        >
          <Inbox className="h-4 w-4" />
          {t('inbox')}
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-medium',
              preset.badge,
            )}
          >
            {tasks.length}
          </span>
          <button
            onClick={() => setIsCollapsed(true)}
            className={cn('rounded p-1 transition-colors', preset.accent)}
            title={t('inbox_collapse')}
          >
            <ArrowRightToLine className="h-4 w-4 rotate-180" />
          </button>

          {/* Three-dot menu: Color only for Inbox */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn('rounded p-1 transition-colors', preset.accent)}
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Palette className="h-4 w-4 mr-2" />
                  {t('board_color_label')}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={getColor(INBOX_COLOR_KEY)}
                    onValueChange={(val) => handleColorChange(val as BoardColor)}
                  >
                    {BOARD_COLOR_PRESETS.map((p) => (
                      <DropdownMenuRadioItem key={p.id} value={p.id}>
                        <span className={cn('inline-block h-3 w-3 rounded-full mr-2', p.swatch)} />
                        {t(p.i18nKey)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={INBOX_DROPPABLE_ID}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'flex-1 px-2.5 overflow-y-auto overflow-x-hidden min-h-[150px] transition-colors duration-200 pb-2 pt-2',
              snapshot.isDraggingOver ? preset.placeholder : '',
            )}
          >
            {tasks.map((task, index) => (
              <TaskBoardCard key={task.id} task={task} index={index} onEdit={onEditTask} />
            ))}
            {provided.placeholder}

            {/* Quick Add Form */}
            {isAdding ? (
              <div className="mt-2 space-y-2">
                <input
                  autoFocus
                  className={cn(
                    'w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 placeholder:text-muted-foreground transition-all',
                    preset.button,
                  )}
                  placeholder={t('inbox_add_placeholder')}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleQuickAdd();
                    } else if (e.key === 'Escape') {
                      setIsAdding(false);
                    }
                  }}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleQuickAdd}
                    className="rounded-md bg-primary hover:bg-primary/90 px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors"
                  >
                    {t('add_card')}
                  </button>
                  <button
                    onClick={() => setIsAdding(false)}
                    className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center justify-between group/add">
                <button
                  onClick={() => setIsAdding(true)}
                  className={cn(
                    'flex flex-1 items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors',
                    preset.button,
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {t('add_card')}
                </button>
                <button
                  onClick={() => onAddTask()}
                  className={cn(
                    'p-2 rounded-md opacity-0 group-hover/add:opacity-100 transition-all',
                    preset.button,
                  )}
                  title={t('open_full_dialog')}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M2.5 2.5h6v1.5h-6v-1.5zM2.5 5.5h11v1.5h-11v-1.5zM2.5 8.5h11v1.5h-11v-1.5zM2.5 11.5h8v1.5h-8v-1.5z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
