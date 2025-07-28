// src/hooks/use-autosave.ts
import { usePlaygroundStore } from '@/store/use-playground-store';
import { useEffect, useRef } from 'react';

export function useAutoSave() {
  // Get the current state from our Zustand store.
  const { session, chatHistory, jsxCode, cssCode } = usePlaygroundStore();
  
  // Use a ref to track if this is the initial load, to prevent saving on mount.
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // If it's the initial load, don't save. Just set the ref to false.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }

    // Set up a timer to save after a delay (e.g., 1 second).
    // This is called "debouncing" and prevents too many API calls.
    const saveTimeout = setTimeout(() => {
      if (!session) return;

      // console.log('Auto-saving session...');

      fetch(`/api/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: session.name, // We can add logic to rename sessions later
          chatHistory,
          jsxCode,
          cssCode,
        }),
      })
      .then(res => {
        if (res.ok) {
          // console.log('Session saved successfully.');
        } else {
          console.error('Failed to save session. Status:', res.status);

        }
      })
      .catch(err => {
        console.error('Error saving session:', err);
      });
    }, 1000); // 1 second delay

    // Cleanup function: if the component unmounts or dependencies change,
    // clear the timeout to prevent saving stale data.
    return () => clearTimeout(saveTimeout);

  }, [session, chatHistory, jsxCode, cssCode]); // This effect runs whenever these dependencies change.
}
