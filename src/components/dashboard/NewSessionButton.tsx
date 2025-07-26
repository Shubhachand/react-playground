// src/components/dashboard/NewSessionButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/Button';

export default function NewSessionButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions', { method: 'POST' });
      if (res.ok) {
        const newSession = await res.json();
        // Redirect to the new session's page
        router.push(`/session/${newSession.id}`);
      } else {
        // Handle error
        console.error('Failed to create a new session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleCreateSession} isLoading={isLoading} className="w-auto">
      {isLoading ? 'Creating...' : '+ New Session'}
    </Button>
  );
}
