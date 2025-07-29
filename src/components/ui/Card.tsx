// src/components/ui/Card.tsx
import React from 'react';
import clsx from 'clsx'; // optional but helpful for class merging

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx("bg-white shadow-md rounded-lg p-8", className)}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <h2 className={clsx("text-2xl font-bold text-center mb-6", className)}>{children}</h2>;
}
