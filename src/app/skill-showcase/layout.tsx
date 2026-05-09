import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill Showcase - Capability Atlas",
  description: "Explore and discover AI agent skills and capabilities",
};

export default function SkillShowcaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="ss-wrapper">{children}</div>;
}
