'use client';

import { Button } from '@/components/ui/button';

interface NotesPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (updater: (p: number) => number) => void;
}

export function NotesPagination({ page, totalPages, onPageChange }: NotesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="border-border/40 mt-6 flex items-center justify-between border-t pt-4">
      <span className="text-muted-foreground text-sm">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
