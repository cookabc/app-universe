
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const templates = [
  { name: "Customer Service Bot", description: "A friendly and helpful chatbot for your website.", category: "Chatbots" },
  { name: "Code Generation Assistant", description: "Generate boilerplate code in any language.", category: "Development" },
  { name: "Social Media Post Generator", description: "Create engaging posts for your social media accounts.", category: "Marketing" },
  { name: "Email Responder", description: "Automatically draft replies to common emails.", category: "Productivity" },
  { name: "Creative Story Writer", description: "Generate creative story ideas and outlines.", category: "Writing" },
  { name: "Technical Documentation Writer", description: "Draft technical documentation for your projects.", category: "Development" },
];

export default function TemplatesPageMock() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Universe</h1>
        <Button variant="ghost">Back to Home</Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold">Templates Marketplace</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Jumpstart your projects with our curated collection of AI templates.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-lg">
            <Input placeholder="Search templates..." className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">{template.description}</p>
                <Button variant="link" className="p-0 mt-4">Use Template</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
