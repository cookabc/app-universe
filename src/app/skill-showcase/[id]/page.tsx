"use client";

import { use } from "react";
import dynamic from "next/dynamic";

const SkillDetail = dynamic(() => import("../components/SkillDetailPage"), {
  ssr: false,
  loading: () => (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
        Loading skill…
      </span>
    </div>
  ),
});

export default function SkillDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SkillDetail id={id} />;
}
