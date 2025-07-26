// src/components/ui/Card.tsx
import React from 'react';

// A simple reusable card component for consistent styling of containers.
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-center mb-6">{children}</h2>;
}
