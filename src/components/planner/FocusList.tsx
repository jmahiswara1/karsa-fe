'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { motion } from 'framer-motion';
import { FocusItem } from './FocusItem';
import type { PlannerEntry } from '@/hooks/use-planner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

interface FocusListProps {
  entries: PlannerEntry[];
  onItemClick: (entry: PlannerEntry) => void;
  onReorder: (entries: PlannerEntry[]) => void;
}

export function FocusList({ entries, onItemClick, onReorder }: FocusListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const sortedEntries = [...entries].sort((a, b) => a.order - b.order);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedEntries.findIndex((e) => e.id === active.id);
    const newIndex = sortedEntries.findIndex((e) => e.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(sortedEntries, oldIndex, newIndex);
    const withNewOrder = reordered.map((entry, i) => ({ ...entry, order: i }));
    onReorder(withNewOrder);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext
        items={sortedEntries.map((e) => e.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          {sortedEntries.map((entry, index) => (
            <motion.div key={entry.id} variants={itemVariants}>
              <FocusItem entry={entry} index={index} onClick={onItemClick} />
            </motion.div>
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}
