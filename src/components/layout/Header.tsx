// src/components/layout/Header.tsx
'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Button } from '../ui/Button';
import Link from 'next/link'; // <-- Import the Link component

export default function Header({ userName }: { userName: string }) {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Wrap the h1 with a Link component pointing to the homepage */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          PlayReact
        </Link>
        <div className="flex items-center space-x-4">
     <div className="flex items-center gap-3 px-3 py-1 bg-gray-100 rounded-full hover:shadow-sm transition">
  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm uppercase">
    {userName?.[0]}
  </div>
  <span className="text-gray-800 font-medium text-sm truncate max-w-[100px]">
    {userName}
  </span>
</div>

          <Button onClick={handleLogout} className="w-auto px-4 py-2 text-sm">
            Logout
          </Button>
        </div>
      </nav>
    </header>
  );
}
