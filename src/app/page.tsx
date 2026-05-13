"use client";

import { ToolGrid } from "@/components/ToolGrid";
import { ToolWallHeader } from "@/components/ToolWallHeader";

export default function HomePage() {
  return (
    <div>
      <div className="px-4 pt-2 pb-4">
        <ToolWallHeader />
      </div>
      <div className="container max-w-7xl mx-auto px-4 pb-12">
        <ToolGrid />
      </div>
    </div>
  );
}
