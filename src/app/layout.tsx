import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AppChrome } from "@/components/AppChrome";
import { I18nProvider } from "@/components/I18nProvider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const outfit = Outfit({ subsets: ["latin"], variable: "--font-serif" });
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "App Universe",
  description: "Discover and use amazing AI-powered tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${outfit.variable} ${jetBrainsMono.variable} antialiased min-w-[320px]`}
      >
        <I18nProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            enableColorScheme
            storageKey="app-universe-theme"
          >
            <TooltipProvider delayDuration={300}>
              <div className="flex flex-col min-h-screen bg-background">
                <AppChrome>{children}</AppChrome>
              </div>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
