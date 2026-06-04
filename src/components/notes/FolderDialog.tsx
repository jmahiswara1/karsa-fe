'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateNoteFolder, useUpdateNoteFolder, NoteFolder } from '@/hooks/use-note-folders';
import { toast } from 'sonner';

interface FolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder?: NoteFolder | null;
  parentId?: string | null;
}

export function FolderDialog({ open, onOpenChange, folder, parentId }: FolderDialogProps) {
  const t = useTranslations('Notes'); // Add translations if needed, or use static text
  const [name, setName] = useState('');
  
  const createFolder = useCreateNoteFolder();
  const updateFolder = useUpdateNoteFolder();

  useEffect(() => {
    if (open) {
      setName(folder ? folder.name : '');
    }
  }, [open, folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (folder) {
        await updateFolder.mutateAsync({ id: folder.id, data: { name } });
        toast.success('Folder updated successfully');
      } else {
        await createFolder.mutateAsync({ name, parentId: parentId || null });
        toast.success('Folder created successfully');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{folder ? 'Rename Folder' : 'Create Folder'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Folder name..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || createFolder.isPending || updateFolder.isPending}>
              {folder ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
