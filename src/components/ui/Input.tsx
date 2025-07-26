import React from 'react';

// A reusable, styled input component that can be used across the application.
// It accepts all standard input props.
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 border border-gray-300 rounded-md 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 text-gray-900 bg-white placeholder-gray-400"
    />
  );
}
