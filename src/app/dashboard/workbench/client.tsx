
'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { File, Folder, Play, Terminal, UploadCloud } from "lucide-react";
import Editor from '@monaco-editor/react';

const files = {
  'src/app.py': {
    name: 'app.py',
    language: 'python',
    content: `import os
from openai import OpenAI

client = OpenAI()
client.api_key = os.getenv("OPENAI_API_KEY")

def generate_text(prompt):
  response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": prompt}]
  )
  return response.choices[0].message.content

print(generate_text("Hello, world!"))`,
  },
  'src/requirements.txt': {
    name: 'requirements.txt',
    language: 'text',
    content: 'openai\nnumpy',
  },
};

export default function Workbench() {
  const [activeFile, setActiveFile] = useState('src/app.py');
  const file = files[activeFile as keyof typeof files];
  const [terminalOutput, setTerminalOutput] = useState('');

  const handleRun = () => {
    setTerminalOutput(`$ python ${file.name}\nHello from GPT-4!\n`);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold mb-4">File Explorer</h2>
        <div className="flex-grow space-y-2">
          <div className="flex items-center"><Folder className="h-5 w-5 mr-2" /> src</div>
          {Object.keys(files).map((path) => (
            <div key={path} className="flex items-center ml-4 cursor-pointer" onClick={() => setActiveFile(path)}>
              <File className="h-5 w-5 mr-2" /> {files[path as keyof typeof files].name}
            </div>
          ))}
        </div>
        <Button variant="secondary"><UploadCloud className="mr-2 h-4 w-4" /> Deploy</Button>
      </aside>

      <div className="flex-1 flex flex-col">
        <div className="flex-grow flex flex-col">
          <div className="bg-gray-700 text-white p-2 flex justify-between items-center">
            <span>{file.name}</span>
            <Button size="sm" onClick={handleRun}><Play className="mr-2 h-4 w-4" /> Run</Button>
          </div>
          <Editor
            height="100%"
            language={file.language}
            value={file.content}
            theme="vs-dark"
          />
        </div>
        <div className="h-1/3 bg-gray-800 flex flex-col">
            <div className="bg-gray-700 text-white p-2 flex items-center">
                <Terminal className="h-5 w-5 mr-2" />
                <span>Terminal</span>
            </div>
            <div className="flex-grow p-4 font-mono text-sm whitespace-pre-wrap">
                {terminalOutput}
            </div>
        </div>
      </div>
    </div>
  );
}
