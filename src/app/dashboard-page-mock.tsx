
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Code, FileText, LifeBuoy, Palette, Settings, User } from "lucide-react";

export default function DashboardPageMock() {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <aside className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8">AI Universe</h1>
          <nav className="space-y-2">
            <Button variant="secondary" className="w-full justify-start"><Palette className="mr-2 h-4 w-4" /> Dashboard</Button>
            <Button variant="ghost" className="w-full justify-start"><FileText className="mr-2 h-4 w-4" /> Prompt Lab</Button>
            <Button variant="ghost" className="w-full justify-start"><Code className="mr-2 h-4 w-4" /> AI Workbench</Button>
            <Button variant="ghost" className="w-full justify-start"><User className="mr-2 h-4 w-4" /> Artifacts</Button>
          </nav>
        </div>
        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
          <Button variant="ghost" className="w-full justify-start"><LifeBuoy className="mr-2 h-4 w-4" /> Help</Button>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Welcome back, Alex!</h2>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>
            <User className="h-8 w-8 rounded-full" />
          </div>
        </header>

        <main className="flex-grow p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul>
                  <li>- Edited "Chatbot Prompt"</li>
                  <li>- Deployed "Image Generator App"</li>
                  <li>- Shared "My First Artifact"</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button variant="outline">New Prompt</Button>
                <Button variant="outline">New Project in Workbench</Button>
                <Button variant="outline">New Artifact</Button>
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Subscription Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p>You are currently on the <span className="font-bold text-purple-500">Pro Plan</span>.</p>
                <Button variant="link" className="p-0 mt-2">Manage Subscription</Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">My AI Artifacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card><CardContent className="p-4">Artifact 1</CardContent></Card>
                <Card><CardContent className="p-4">Artifact 2</CardContent></Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
