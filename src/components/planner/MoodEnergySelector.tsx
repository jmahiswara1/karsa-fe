'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Smile,
  Meh,
  CloudSun,
  CloudRain,
  Crosshair,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const energyLevels = [
  {
    key: 'LOW',
    icon: BatteryLow,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    ring: 'ring-amber-200 dark:ring-amber-800/30',
  },
  {
    key: 'MEDIUM',
    icon: BatteryMedium,
    color: 'text-sky-500',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    ring: 'ring-sky-200 dark:ring-sky-800/30',
  },
  {
    key: 'HIGH',
    icon: BatteryFull,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    ring: 'ring-emerald-200 dark:ring-emerald-800/30',
  },
] as const;

const moods = [
  { key: 'CALM', icon: Smile, color: 'text-sky-500' },
  { key: 'NEUTRAL', icon: Meh, color: 'text-slate-500' },
  { key: 'TIRED', icon: CloudSun, color: 'text-amber-500' },
  { key: 'STRESSED', icon: CloudRain, color: 'text-red-500' },
  { key: 'FOCUSED', icon: Crosshair, color: 'text-indigo-500' },
] as const;

interface MoodEnergySelectorProps {
  energy: string;
  onEnergyChange: (level: string) => void;
  mood: string;
  onMoodChange: (mood: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 4 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function MoodEnergySelector({
  energy,
  onEnergyChange,
  mood,
  onMoodChange,
}: MoodEnergySelectorProps) {
  const t = useTranslations('Focus');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5"
    >
      {/* Energy */}
      <div className="flex flex-col gap-3">
        <label className="text-sm leading-normal font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {t('energy_label')}
        </label>
        <div className="border-border/50 bg-muted/30 flex w-fit flex-wrap gap-1 rounded-xl border p-1">
          {energyLevels.map((level) => {
            const Icon = level.icon;
            const selected = energy === level.key;
            return (
              <motion.button
                key={level.key}
                variants={childVariants}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEnergyChange(level.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  selected
                    ? `${level.bg} ${level.color} ring-1 ${level.ring}`
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(`energy_${level.key.toLowerCase()}`)}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Mood */}
      <div className="flex flex-col gap-3">
        <label className="text-sm leading-normal font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {t('mood_label')}
        </label>
        <div className="border-border/50 bg-muted/30 flex w-fit flex-wrap gap-1 rounded-xl border p-1">
          {moods.map((m) => {
            const Icon = m.icon;
            const selected = mood === m.key;
            return (
              <motion.button
                key={m.key}
                variants={childVariants}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMoodChange(m.key)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                  selected
                    ? `bg-white dark:bg-slate-800 ${m.color} ring-border shadow-sm ring-1`
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(`mood_${m.key.toLowerCase()}`)}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
