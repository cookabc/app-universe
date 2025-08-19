
'use client'

import { withAuth } from '@/hooks/withAuth';
import { Button } from "@/components/ui/button";
import { Bell, Code, FileText, LifeBuoy, Palette, Settings, User } from "lucide-react";
import Link from "next/link";

function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8"><Link href="/">AI Universe</Link></h1>
          <nav className="space-y-2">
            <Link href="/dashboard"><Button variant="secondary" className="w-full justify-start"><Palette className="mr-2 h-4 w-4" /> Dashboard</Button></Link>
            <Link href="/dashboard/prompt-lab"><Button variant="ghost" className="w-full justify-start"><FileText className="mr-2 h-4 w-4" /> Prompt Lab</Button></Link>
            <Link href="/dashboard/workbench"><Button variant="ghost" className="w-full justify-start"><Code className="mr-2 h-4 w-4" /> AI Workbench</Button></Link>
            <Link href="/dashboard/artifacts"><Button variant="ghost" className="w-full justify-start"><User className="mr-2 h-4 w-4" /> Artifacts</Button></Link>
          </nav>
        </div>
        <nav className="space-y-2">
          <Link href="/settings"><Button variant="ghost" className="w-full justify-start"><Settings className="mr-2 h-4 w-4" /> Settings</Button></Link>
          <Link href="/help"><Button variant="ghost" className="w-full justify-start"><LifeBuoy className="mr-2 h-4 w-4" /> Help</Button></Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div></div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <User className="h-8 w-8 rounded-full" />
          </div>
        </header>
        <main className="flex-grow p-8">
            {children}
        </main>
      </div>
    </div>
  );
}

export default withAuth(DashboardLayout);
