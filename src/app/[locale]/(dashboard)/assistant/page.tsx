'use client';

import { useAuthStore } from '@/store/auth.store';
import { ChatInterface } from '@/components/assistant/ChatInterface';
import { ContextSidebar } from '@/components/assistant/ContextSidebar';

export default function AssistantPage() {
  const { user } = useAuthStore();

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col gap-6 pb-6 lg:flex-row">
      <div className="min-w-0 flex-1">
        <ChatInterface userAvatar={user?.avatarUrl} />
      </div>
      <div className="hidden shrink-0 lg:block">
        <ContextSidebar />
      </div>
      {/* Mobile Context Sidebar */}
      <div className="mt-4 block pb-12 lg:hidden">
        <ContextSidebar />
      </div>
    </div>
  );
}
