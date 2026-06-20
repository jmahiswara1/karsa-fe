'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Droppable } from '@hello-pangea/dnd';
import { TaskBoardCard } from './TaskBoardCard';
import {
  Plus,
  MoreHorizontal,
  ArrowRightToLine,
  X,
  Palette,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, TaskColumn } from '@/hooks/use-tasks';
import { useCreateTask, useUpdateTaskColumn, useDeleteTaskColumn } from '@/hooks/use-tasks';
import { useBoardColors } from '@/hooks/use-board-colors';
import { getBoardColorPreset, BOARD_COLOR_PRESETS, type BoardColor } from './board-colors';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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

interface TaskBoardColumnProps {
  column: TaskColumn;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
}

export function TaskBoardColumn({ column, tasks, onAddTask, onEditTask }: TaskBoardColumnProps) {
  const t = useTranslations('Tasks');
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(column.name);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const createTask = useCreateTask();
  const updateColumn = useUpdateTaskColumn();
  const deleteColumn = useDeleteTaskColumn();
  const { getColor, setColor } = useBoardColors();

  const preset = getBoardColorPreset(getColor(column.id));

  const handleQuickAdd = async () => {
    if (!newTaskTitle.trim()) {
      setIsAdding(false);
      return;
    }

    createTask.mutate(
      {
        title: newTaskTitle,
        columnId: column.id,
      },
      {
        onSuccess: () => {
          setNewTaskTitle('');
        },
      },
    );
  };

  const handleRename = () => {
    if (!renameValue.trim() || renameValue === column.name) {
      setIsRenaming(false);
      setRenameValue(column.name);
      return;
    }
    updateColumn.mutate(
      { id: column.id, name: renameValue.trim() },
      {
        onSuccess: () => {
          setIsRenaming(false);
        },
      },
    );
  };

  const handleDelete = () => {
    deleteColumn.mutate(column.id);
    setShowDeleteAlert(false);
  };

  const handleColorChange = (color: BoardColor) => {
    setColor(column.id, color);
  };

  if (isCollapsed) {
    return (
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            onClick={() => setIsCollapsed(false)}
            className={cn(
              'flex h-full w-14 shrink-0 flex-col items-center rounded-xl overflow-hidden shadow-sm transition-all duration-300 py-3 cursor-pointer',
              preset.container,
              snapshot.isDraggingOver ? cn(preset.placeholder, 'ring-2 ring-primary/20') : '',
            )}
          >
            <button
              className={cn('p-1.5 mb-3 rounded-md transition-colors', preset.accent)}
              title={t('expand_column')}
            >
              <ArrowRightToLine className="h-4 w-4" />
            </button>
            <div className="flex-1 flex flex-col items-center">
              <div
                className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                {column.name}
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
    <>
      <div
        className={cn(
          'flex h-full w-80 shrink-0 flex-col rounded-xl overflow-hidden shadow-sm transition-all duration-300',
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
          {isRenaming ? (
            <input
              autoFocus
              className="flex-1 text-sm font-semibold tracking-tight bg-transparent border-b border-primary focus:outline-none px-0.5"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleRename();
                } else if (e.key === 'Escape') {
                  setIsRenaming(false);
                  setRenameValue(column.name);
                }
              }}
            />
          ) : (
            <h3
              className={cn(
                'text-sm font-semibold tracking-tight',
                preset.accent,
              )}
            >
              {column.name}
            </h3>
          )}
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
              title={t('collapse_column')}
            >
              <ArrowRightToLine className="h-4 w-4 rotate-180" />
            </button>

            {/* Three-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn('rounded p-1 transition-colors', preset.accent)}
              >
                <MoreHorizontal className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* Color submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Palette className="h-4 w-4 mr-2" />
                    {t('board_color_label')}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={getColor(column.id)}
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

                {/* Rename & Delete only for non-system columns */}
                {!column.isSystem && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setRenameValue(column.name);
                        setIsRenaming(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      {t('board_rename')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-foreground focus:text-foreground"
                      onClick={() => setShowDeleteAlert(true)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('board_delete')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Droppable Area */}
        <Droppable droppableId={column.id}>
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
                <TaskBoardCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  isDone={column.name.toLowerCase().includes('done')}
                />
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
                    placeholder={t('enter_title')}
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
                    onClick={() => onAddTask(column.id)}
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('board_delete_title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('board_delete_desc')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              {t('board_delete_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
