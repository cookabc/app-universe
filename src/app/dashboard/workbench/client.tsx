
'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { File, Folder, Play, Terminal, UploadCloud } from "lucide-react";

export default function Workbench() {
  return (
    <div className="flex h-[calc(100vh-12rem)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">File Explorer</h2>
        <div className="flex-grow space-y-2">
          <div className="flex items-center"><Folder className="h-5 w-5 mr-2" /> src</div>
          <div className="flex items-center ml-4"><File className="h-5 w-5 mr-2" /> app.py</div>
          <div className="flex items-center"><File className="h-5 w-5 mr-2" /> requirements.txt</div>
        </div>
        <Button variant="secondary"><UploadCloud className="mr-2 h-4 w-4" /> Deploy</Button>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex-grow flex flex-col">
          <div className="bg-gray-700 text-white p-2 flex justify-between items-center">
            <span>app.py</span>
            <Button size="sm"><Play className="mr-2 h-4 w-4" /> Run</Button>
          </div>
          <div className="flex-grow bg-gray-900 font-mono p-4">
            <pre>
              <code>
                {
`import os
from openai import OpenAI

client = OpenAI()
client.api_key = os.getenv("OPENAI_API_KEY")

def generate_text(prompt):
  response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
  )
  return response.choices[0].message.content

print(generate_text("Hello, world!"))`
                }
              </code>
            </pre>
          </div>
        </div>
        <div className="h-1/3 bg-gray-800 flex flex-col">
            <div className="bg-gray-700 text-white p-2 flex items-center">
                <Terminal className="h-5 w-5 mr-2" />
                <span>Terminal</span>
            </div>
            <div className="flex-grow p-4 font-mono text-sm">
                <p className="text-green-400">$ python app.py</p>
                <p>Hello from GPT-4!</p>
            </div>
        </div>
      </div>
    </div>
  );
}
