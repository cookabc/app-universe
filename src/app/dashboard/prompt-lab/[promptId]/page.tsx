
import { getPrompt, createPromptVersion } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type PromptDetailPageProps = {
    params: {
        promptId: string;
    };
};

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
    const prompt = await getPrompt(parseInt(params.promptId));

    if (!prompt) {
        return <div>Prompt not found</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">{prompt.name}</h1>
            <p className="text-gray-500 mb-8">{prompt.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Versions</h2>
                    <div className="space-y-4">
                        {prompt.versions.map((version) => (
                            <Card key={version.id}>
                                <CardHeader>
                                    <CardTitle>Version {version.version}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>{version.content}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">New Version</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle>Create a New Version</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form action={async (formData) => {
                                'use server';
                                const content = formData.get('content') as string;
                                await createPromptVersion(prompt.id, content);
                            }}>
                                <Textarea name="content" placeholder="Enter the new prompt version..." />
                                <Button type="submit" className="mt-4">Create Version</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
