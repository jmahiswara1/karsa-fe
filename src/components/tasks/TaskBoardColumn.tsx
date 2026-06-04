'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Droppable } from '@hello-pangea/dnd';
import { TaskBoardCard } from './TaskBoardCard';
import { Plus, MoreHorizontal, ArrowRightToLine, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task, TaskColumn } from '@/hooks/use-tasks';
import { useCreateTask } from '@/hooks/use-tasks';

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
  const createTask = useCreateTask();

  const [isCollapsed, setIsCollapsed] = useState(false);

  // Determine styles based on column name for minimal accent
  const name = column.name.toLowerCase();
  let colorStyles = 'bg-muted/40 text-foreground border border-border/40';
  let iconStyles = 'text-muted-foreground hover:bg-muted-foreground/20';
  let badgeStyles = 'text-muted-foreground font-semibold text-xs ml-1 opacity-70';

  const handleQuickAdd = async () => {
    if (!newTaskTitle.trim()) {
      setIsAdding(false);
      return;
    }
    
    // Quick create
    createTask.mutate(
      {
        title: newTaskTitle,
        columnId: column.id,
      },
      {
        onSuccess: () => {
          setNewTaskTitle('');
          // Keep it open to add more
        },
      }
    );
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
              "flex h-full w-14 shrink-0 flex-col items-center rounded-xl overflow-hidden shadow-sm transition-all duration-300 py-3 cursor-pointer hover:bg-muted/60",
              colorStyles,
              snapshot.isDraggingOver ? 'bg-muted/80 ring-2 ring-primary/20' : ''
            )}
          >
            <button className={cn("p-1.5 mb-3 rounded-md transition-colors", iconStyles)} title="Expand column">
              <ArrowRightToLine className="h-4 w-4" />
            </button>
            <div className="flex-1 flex flex-col items-center">
               <div 
                 className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap"
                 style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
               >
                 {column.name} 
                 <span className={cn("flex min-w-[1.25rem] items-center justify-center rounded-full px-1 py-1 text-[10px] font-bold rotate-90", badgeStyles)}>
                   {tasks.length}
                 </span>
               </div>
            </div>
            {/* Render placeholder for drops */}
            <div className="hidden">
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
    );
  }

  return (
    <div className={cn("flex h-full w-80 shrink-0 flex-col rounded-xl overflow-hidden shadow-sm transition-all duration-300", colorStyles)}>
      {/* Column Header */}
      <div className="flex items-center justify-between px-3.5 py-3 border-b border-border/40 bg-muted/20">
        <h3 className="text-sm font-semibold tracking-tight">{column.name}</h3>
        <div className="flex items-center gap-1.5">
          <span className={cn("flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-medium", badgeStyles)}>
            {tasks.length}
          </span>
          <button 
            onClick={() => setIsCollapsed(true)}
            className={cn("rounded p-1 transition-colors", iconStyles)}
            title="Collapse column"
          >
            <ArrowRightToLine className="h-4 w-4 rotate-180" />
          </button>
          <button className={cn("rounded p-1 transition-colors", iconStyles)}>
            <MoreHorizontal className="h-4 w-4" />
          </button>
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
              snapshot.isDraggingOver ? 'bg-muted/60' : ''
            )}
          >
            {tasks.map((task, index) => (
              <TaskBoardCard
                key={task.id}
                task={task}
                index={index}
                onEdit={onEditTask}
                isDone={name.includes('done')}
              />
            ))}
            {provided.placeholder}
            
            {/* Quick Add Form */}
            {isAdding ? (
              <div className="mt-2 space-y-2">
                <input
                  autoFocus
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground transition-all"
                  placeholder="Enter a title or paste a link"
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
                    Add card
                  </button>
                  <button className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/80 transition-colors">
                    <Lightbulb className="h-3.5 w-3.5" />
                    Tip
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
                  className="flex flex-1 items-center gap-2 rounded-md p-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add a card
                </button>
                <button 
                  onClick={() => onAddTask(column.id)}
                  className="p-2 rounded-md opacity-0 group-hover/add:opacity-100 hover:bg-muted transition-all text-muted-foreground hover:text-foreground"
                  title="Open full dialog"
                >
                  {/* Small icon for full dialog as in screenshot right side */}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 2.5h6v1.5h-6v-1.5zM2.5 5.5h11v1.5h-11v-1.5zM2.5 8.5h11v1.5h-11v-1.5zM2.5 11.5h8v1.5h-8v-1.5z"></path></svg>
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
