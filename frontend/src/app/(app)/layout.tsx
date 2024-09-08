import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/navbar";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { ModeToggle } from "@/components/toggle-theme-button";

export const metadata: Metadata = {
  title: "IS442 Project",
  description: "A custom CRM built for a school project",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", fontSans.variable)}>
        <div className="flex flex-row justify-between p-4 items-center">
          <Navbar className="mx-6" />
          <ModeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
