// src/components/auth/SignupForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import Link from 'next/link';
import Cookies from 'js-cookie'; // Import the cookie library

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // If signup is successful, save the token and redirect to the dashboard.
        Cookies.set('token', data.token, { expires: 1 });
        router.push('/'); // Redirect to the dashboard
        router.refresh(); // Refresh to ensure server components re-render
      } else {
        setError(data.message || 'Something went wrong.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="backdrop-blur-lg bg-white/60 border border-gray-200 shadow-xl p-6 rounded-xl text-gray-800">
      <CardHeader className="text-2xl font-bold mb-4 text-center text-black">
        Create an Account
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 text-gray-700">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-700">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white border border-gray-300 text-gray-800 placeholder-gray-400"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" isLoading={isLoading} className="w-full">
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Log in
        </Link>
      </p>
    </Card>
  );
}
