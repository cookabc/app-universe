import { Link } from "react-router-dom";
import type { SkillData } from "../../data/skills";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  skill: SkillData;
  index: number;
}

export default function SkillCard({ skill, index }: Props) {
  const cat = skill.category;
  const num = String(index + 1).padStart(2, "0");
  
  return (
    <Link to={`/skill/${skill.id}`} className="block group">
      <Card className="overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-lg hover:-translate-y-1 group-hover:border-primary">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-primary/70 font-mono">
              {num}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/18 text-primary font-medium">
              {cat.label}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-3 line-clamp-2">
            {skill.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {skill.description || "No description available"}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono tabular-nums">
            <span>{skill.stats.lineCount} lines</span>
            <span>·</span>
            <span>{skill.fileInfo.totalFiles} files</span>
            <span>·</span>
            <span>{skill.stats.complexityLabel}</span>
          </div>
        </CardContent>
        <div className="h-0.5 bg-gradient-to-r from-primary to-transparent opacity-50" />
      </Card>
    </Link>
  );
}
