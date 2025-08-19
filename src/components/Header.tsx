
'use client'

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";

export const Header = () => {
  const { isLoggedIn, logout } = useSession();

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Universe</Link>
      <nav className="hidden md:flex items-center space-x-4">
        <Link href="/templates"><Button variant="ghost">Templates</Button></Link>
        <Link href="/pricing"><Button variant="ghost">Pricing</Button></Link>
        <Link href="/docs"><Button variant="ghost">Docs</Button></Link>
        <Link href="/blog"><Button variant="ghost">Blog</Button></Link>
      </nav>
      <div className="hidden md:flex items-center space-x-2">
        {isLoggedIn ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <>
            <Link href="/login"><Button variant="outline">Login</Button></Link>
            <Link href="/signup"><Button>Sign Up</Button></Link>
          </>
        )}
      </div>
    </header>
  );
};
