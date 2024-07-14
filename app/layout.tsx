import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const titillium = Titillium_Web({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Komikgan",
  description: "Baca Komik Bahasa Indonesia",
};

export const revalidate = 0

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(titillium.className, "min-h-screen antialiased scroll-smooth")}>
        <SessionProvider>
          <QueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
