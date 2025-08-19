
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const posts = [
  { title: "The Ultimate Guide to Prompt Engineering", description: "Learn the art and science of crafting effective prompts for large language models.", date: "June 10, 2024" },
  { title: "Building Your First AI App with AI Universe", description: "A step-by-step tutorial on how to use the AI Workbench to create and deploy a simple AI application.", date: "June 17, 2024" },
  { title: "The Future of AI Development", description: "A look at the trends and technologies that are shaping the future of AI development.", date: "June 24, 2024" },
];

export default function BlogPageMock() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Universe Blog</h1>
        <Button variant="ghost">Back to Home</Button>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-extrabold">News, Tutorials, and Insights</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Your source for the latest in AI development and prompt engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <Card key={i} className="flex flex-col">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 dark:text-gray-300">{post.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{post.date}</span>
                <Button variant="link">Read More</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
