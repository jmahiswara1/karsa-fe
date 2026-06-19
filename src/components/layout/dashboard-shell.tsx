'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileSidebar } from '@/components/layout/mobile-sidebar';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useChatStore } from '@/store/chat.store';
import { useMiniChatStore } from '@/store/mini-chat.store';

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { fetchProfile, user, isLoggingOut } = useAuthStore();
  const { loadFromLocalStorage, syncFromBackend } = useChatStore();
  const { loadFromLocalStorage: loadMiniChat, saveToLocalStorage: saveMiniChat } =
    useMiniChatStore();

  useEffect(() => {
    if (!user && !isLoggingOut) {
      fetchProfile();
    }
  }, [fetchProfile, user, isLoggingOut]);

  const saveToLocalStorage = useChatStore((s) => s.saveToLocalStorage);

  // Initialize chat persistence when user is available
  useEffect(() => {
    if (user?.id) {
      loadFromLocalStorage(user.id);
      syncFromBackend();
      loadMiniChat(user.id);
    }
  }, [user?.id, loadFromLocalStorage, syncFromBackend, loadMiniChat]);

  // Auto-save chat state to localStorage on changes
  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = useChatStore.subscribe((state) => {
      if (
        state.conversations.length > 0 ||
        state.allMessages.length > 0 ||
        state.deletedConversationIds.length > 0
      ) {
        saveToLocalStorage(user.id);
      }
    });
    return unsubscribe;
  }, [user?.id, saveToLocalStorage]);

  // Auto-save mini-chat state to localStorage on changes
  useEffect(() => {
    if (!user?.id) return;
    const unsubscribe = useMiniChatStore.subscribe((state) => {
      if (state.messages.length > 0) {
        saveMiniChat(user.id);
      }
    });
    return unsubscribe;
  }, [user?.id, saveMiniChat]);

  return (
    <div className="bg-background flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
