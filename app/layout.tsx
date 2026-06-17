import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SoundProvider } from "@/components/providers/sound-provider";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "Budgetly — Dziennik wydatków",
  description: "Aplikacja do zarządzania wydatkami osobistymi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      className={cn("h-full antialiased", "font-sans")}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SoundProvider>{children}</SoundProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
