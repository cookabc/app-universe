
'use client'

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPrompts, createPrompt } from "@/app/actions";
import { prompts } from '@/db/schema';

type Prompt = typeof prompts.$inferSelect;

export default function PromptLabClient() {
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [newPromptName, setNewPromptName] = useState('');
    const [newPromptDescription, setNewPromptDescription] = useState('');

    useEffect(() => {
        getPrompts().then(setPrompts);
    }, []);

    const handleCreatePrompt = async () => {
        await createPrompt(newPromptName, newPromptDescription);
        const updatedPrompts = await getPrompts();
        setPrompts(updatedPrompts);
        setNewPromptName('');
        setNewPromptDescription('');
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Prompt Lab</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Prompt</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Prompt Name"
                            value={newPromptName}
                            onChange={(e) => setNewPromptName(e.target.value)}
                        />
                        <Textarea
                            placeholder="Prompt Description"
                            value={newPromptDescription}
                            onChange={(e) => setNewPromptDescription(e.target.value)}
                        />
                        <Button onClick={handleCreatePrompt}>Create Prompt</Button>
                    </CardContent>
                </Card>
                {prompts.map((prompt) => (
                    <Card key={prompt.id}>
                        <CardHeader>
                            <CardTitle>{prompt.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{prompt.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
