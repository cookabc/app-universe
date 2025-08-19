
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function LandingPageMock() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI Universe</h1>
        <nav className="space-x-4">
          <Button variant="ghost">Features</Button>
          <Button variant="ghost">Pricing</Button>
          <Button variant="ghost">Docs</Button>
          <Button variant="ghost">Blog</Button>
        </nav>
        <div>
          <Button variant="outline" className="mr-2">Login</Button>
          <Button>Sign Up</Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">
            Your All-in-One AI Development Platform
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            From prompt engineering to full-stack AI applications, build, test, and deploy faster than ever.
          </p>
          <Button size="lg" className="mt-8">Get Started for Free</Button>
          <p className="mt-2 text-sm text-gray-500">No credit card required.</p>
        </section>

        <section className="bg-white dark:bg-gray-800 py-20">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-12">Powerful Features to Supercharge Your Workflow</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Prompt Lab</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Visually design, test, and version your prompts. Collaborate with your team and get instant feedback from various models.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>AI Workbench</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>An online IDE purpose-built for AI. Code, debug, and deploy your applications from a single, unified environment.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Artifacts Showcase</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Create a stunning portfolio of your AI projects. Share your work with the world and build your personal brand.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold mb-4">Trusted by Developers at Leading AI Companies</h3>
            <div className="flex justify-center space-x-8 text-gray-500">
              <span>Company A</span>
              <span>Company B</span>
              <span>Company C</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2025 AI Universe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
