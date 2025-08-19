
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div>
        <h2 className="text-3xl font-bold mb-8">Welcome back, Alex!</h2>
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
    </div>
  );
}
