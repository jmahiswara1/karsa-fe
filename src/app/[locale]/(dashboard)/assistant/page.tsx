'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { ChatInterface } from '@/components/assistant/ChatInterface';
import { ContextSidebar } from '@/components/assistant/ContextSidebar';

export default function AssistantPage() {
  const { user } = useAuthStore();
  const [injectedPrompt, setInjectedPrompt] = useState<string>('');

  const handlePromptSelect = (prompt: string) => {
    setInjectedPrompt(prompt);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full flex-col gap-6 lg:flex-row pb-6">
      <div className="flex-1 min-w-0">
        <ChatInterface 
          userAvatar={user?.avatarUrl} 
          initialPrompt={injectedPrompt}
        />
      </div>
      <div className="hidden lg:block shrink-0">
        <ContextSidebar onPromptSelect={handlePromptSelect} />
      </div>
      {/* Mobile Context Sidebar */}
      <div className="block lg:hidden mt-4 pb-12">
        <ContextSidebar onPromptSelect={handlePromptSelect} />
      </div>
    </div>
  );
}
