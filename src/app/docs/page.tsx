
import { Button } from "@/components/ui/button";

export default function DocsPageMock() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-72 bg-white dark:bg-gray-800 p-8 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Documentation</h2>
        <nav className="space-y-2">
          <h3 className="font-semibold">Getting Started</h3>
          <ul className="pl-4 space-y-1">
            <li><Button variant="link" className="p-0">Introduction</Button></li>
            <li><Button variant="link" className="p-0">Quick Start Guide</Button></li>
          </ul>
          <h3 className="font-semibold mt-4">Core Features</h3>
          <ul className="pl-4 space-y-1">
            <li><Button variant="link" className="p-0">Prompt Lab</Button></li>
            <li><Button variant="link" className="p-0">AI Workbench</Button></li>
            <li><Button variant="link" className="p-0">Artifacts</Button></li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-12">
        <article className="prose dark:prose-invert">
          <h1>Introduction</h1>
          <p>
            Welcome to the documentation for AI Universe, your all-in-one platform for building, testing, and deploying AI applications.
          </p>
          <h2>What is AI Universe?</h2>
          <p>
            AI Universe provides a suite of powerful tools designed to streamline the entire AI development lifecycle. Whether you're a seasoned AI engineer or just getting started, our platform has everything you need to bring your ideas to life.
          </p>
          {/* Add more documentation content here */}
        </article>
      </main>
    </div>
  );
}
