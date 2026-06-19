'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ListTodo,
  Folder,
  StickyNote,
  Calendar,
  Loader2,
  Check,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EntityCreation, EntityType } from '@/services/assistant.service';

interface EntityCreationCardProps {
  entity: EntityCreation;
  onConfirm: () => void;
  onCancel: () => void;
  onView?: () => void;
}

const ICONS: Record<EntityType, typeof ListTodo> = {
  task: ListTodo,
  project: Folder,
  note: StickyNote,
  planner_entry: Calendar,
};

export function EntityCreationCard({
  entity,
  onConfirm,
  onCancel,
  onView,
}: EntityCreationCardProps) {
  const t = useTranslations('Assistant.entity_card');
  const Icon = ICONS[entity.type] ?? ListTodo;
  const isPending = entity.status === 'pending_confirmation';
  const isCreated = entity.status === 'created';
  const isFailed = entity.status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'border-border/50 bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm',
        isFailed && 'border-destructive/30 bg-destructive/5',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg',
              isFailed ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-foreground text-sm font-semibold">{entity.title}</p>
            <p className="text-muted-foreground text-xs">{t(`type.${entity.type}`)}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          {isPending && (
            <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-0.5">
              <Loader2 className="h-3 w-3" />
              {t('status.pending')}
            </span>
          )}
          {isCreated && (
            <span className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-2 py-0.5">
              <Check className="h-3 w-3" />
              {t('status.created')}
            </span>
          )}
          {isFailed && (
            <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2 py-0.5">
              <AlertTriangle className="h-3 w-3" />
              {t('status.failed')}
            </span>
          )}
        </div>
      </div>

      {/* Metadata */}
      {entity.data && (
        <div className="text-muted-foreground flex flex-wrap gap-3 text-xs">
          {entity.data.priority ? (
            <span>
              {t('priority')}: {String(entity.data.priority)}
            </span>
          ) : null}
          {entity.data.deadline ? (
            <span>
              {t('deadline')}: {new Date(String(entity.data.deadline)).toLocaleDateString()}
            </span>
          ) : null}
          {entity.data.projectId ? <span>{t('linked_to_project')}</span> : null}
        </div>
      )}

      {entity.error && <p className="text-destructive text-xs">{entity.error}</p>}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isPending && (
          <>
            <button
              type="button"
              onClick={onConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {t('actions.confirm')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-foreground hover:bg-muted rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {t('actions.cancel')}
            </button>
          </>
        )}
        {isCreated && onView && (
          <button
            type="button"
            onClick={onView}
            className="text-primary hover:bg-primary/10 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            {t('actions.view')}
          </button>
        )}
      </div>
    </motion.div>
  );
}
