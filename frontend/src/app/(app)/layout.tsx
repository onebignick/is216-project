import { Navbar } from "@/components/navbar/navigation-bar";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen bg-background text-foreground font-sans antialiased", fontSans.variable)}>
        <Navbar className="mx-6" />
        {children}
      </body>
    </html>
  );
}
