"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const FULLSCREEN_ROUTES = ["/stock"];

export function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isFullscreen) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow container max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </>
  );
}
