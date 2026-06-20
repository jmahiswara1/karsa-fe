export type BoardColor = 'neutral' | 'slate' | 'blue' | 'emerald' | 'amber';

export interface BoardColorPreset {
  id: BoardColor;
  container: string;
  header: string;
  accent: string;
  badge: string;
  button: string;
  placeholder: string;
  swatch: string;
  i18nKey: string;
}

export const BOARD_COLOR_PRESETS: BoardColorPreset[] = [
  {
    id: 'neutral',
    container: 'bg-muted/40 text-foreground border border-border/40',
    header: 'bg-muted/20 border-border/40',
    accent: 'text-muted-foreground',
    badge: 'text-muted-foreground opacity-70',
    button: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    placeholder: 'bg-muted/60',
    swatch: 'bg-gray-300 dark:bg-gray-600',
    i18nKey: 'board_color_neutral',
  },
  {
    id: 'slate',
    container: 'bg-slate-50 text-slate-900 border border-slate-200/60 dark:bg-slate-950/30 dark:text-slate-100 dark:border-slate-800/40',
    header: 'bg-slate-100/50 border-slate-200/60 dark:bg-slate-900/40 dark:border-slate-800/40',
    accent: 'text-slate-600 dark:text-slate-300',
    badge: 'text-slate-600 dark:text-slate-300 opacity-70',
    button: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-100',
    placeholder: 'bg-slate-100/60 dark:bg-slate-900/40',
    swatch: 'bg-slate-400 dark:bg-slate-500',
    i18nKey: 'board_color_slate',
  },
  {
    id: 'blue',
    container: 'bg-blue-50 text-blue-900 border border-blue-200/60 dark:bg-blue-950/20 dark:text-blue-100 dark:border-blue-900/40',
    header: 'bg-blue-100/50 border-blue-200/60 dark:bg-blue-900/30 dark:border-blue-900/40',
    accent: 'text-blue-700/70 dark:text-blue-300/70',
    badge: 'text-blue-700 dark:text-blue-300 opacity-70',
    button: 'text-blue-700/70 dark:text-blue-300/70 hover:bg-blue-100/50 dark:hover:bg-blue-800/30 hover:text-blue-800 dark:hover:text-blue-200',
    placeholder: 'bg-blue-100/50 dark:bg-blue-900/30',
    swatch: 'bg-blue-400 dark:bg-blue-500',
    i18nKey: 'board_color_blue',
  },
  {
    id: 'emerald',
    container: 'bg-emerald-50 text-emerald-900 border border-emerald-200/60 dark:bg-emerald-950/20 dark:text-emerald-100 dark:border-emerald-900/40',
    header: 'bg-emerald-100/50 border-emerald-200/60 dark:bg-emerald-900/30 dark:border-emerald-900/40',
    accent: 'text-emerald-700/70 dark:text-emerald-300/70',
    badge: 'text-emerald-700 dark:text-emerald-300 opacity-70',
    button: 'text-emerald-700/70 dark:text-emerald-300/70 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30 hover:text-emerald-800 dark:hover:text-emerald-200',
    placeholder: 'bg-emerald-100/50 dark:bg-emerald-900/30',
    swatch: 'bg-emerald-400 dark:bg-emerald-500',
    i18nKey: 'board_color_emerald',
  },
  {
    id: 'amber',
    container: 'bg-amber-50 text-amber-900 border border-amber-200/60 dark:bg-amber-950/20 dark:text-amber-100 dark:border-amber-900/40',
    header: 'bg-amber-100/50 border-amber-200/60 dark:bg-amber-900/30 dark:border-amber-900/40',
    accent: 'text-amber-700/70 dark:text-amber-300/70',
    badge: 'text-amber-700 dark:text-amber-300 opacity-70',
    button: 'text-amber-700/70 dark:text-amber-300/70 hover:bg-amber-100/50 dark:hover:bg-amber-800/30 hover:text-amber-800 dark:hover:text-amber-200',
    placeholder: 'bg-amber-100/50 dark:bg-amber-900/30',
    swatch: 'bg-amber-400 dark:bg-amber-500',
    i18nKey: 'board_color_amber',
  },
];

export const getBoardColorPreset = (color: BoardColor): BoardColorPreset => {
  return BOARD_COLOR_PRESETS.find((p) => p.id === color) ?? BOARD_COLOR_PRESETS[0];
};
