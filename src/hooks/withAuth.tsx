
'use client'

import { useSession } from '@/hooks/use-session';
import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export function withAuth<P extends object>(Component: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { isLoggedIn } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        router.push('/login');
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
      return null; // or a loading spinner
    }

    return <Component {...props} />;
  };
}
