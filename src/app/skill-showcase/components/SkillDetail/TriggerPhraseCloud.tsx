import { Badge } from "@/components/ui/badge";

interface Props {
  phrases: string[];
}

export default function TriggerPhraseCloud({ phrases }: Props) {
  if (!phrases?.length) return null;

  return (
    <div className="mb-6 px-4 max-w-3xl mx-auto">
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
        Trigger Phrases
      </h3>
      <div className="flex flex-wrap gap-2">
        {phrases.map((p, i) => (
          <Badge key={i} variant="outline" className="font-mono text-xs">
            {p}
          </Badge>
        ))}
      </div>
    </div>
  );
}
