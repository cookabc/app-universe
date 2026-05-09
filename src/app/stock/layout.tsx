import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Platform - Trading Terminal",
  description: "Professional stock analysis and trading platform",
};

export default function StockLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="stock-wrapper"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {children}
    </div>
  );
}
