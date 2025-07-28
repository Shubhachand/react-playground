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
        router.push(`/session/${newSession.id}`);
        // Don't reset loading — let the new page load
      } else {
        console.error('Failed to create a new session');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateSession}
      disabled={isLoading}
      className={`w-auto ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Creating...' : '+ New Session'}
    </Button>
  );
}
