'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PreferenceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function PreferenceCard({
  icon,
  title,
  description,
  children,
  delay = 0,
  className,
}: PreferenceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className={cn('rounded-2xl', className)}>
        <CardContent className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              {icon}
            </div>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
          </div>
          <div className="min-w-[140px]">{children}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
