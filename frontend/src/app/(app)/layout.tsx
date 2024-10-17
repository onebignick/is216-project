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
        {/* Footer Section */}
        <footer className="fixed bottom-0 border-t p-4 w-full text-center bg-[#99DDCD]">
            <p>© 2024 IS216 MeetGrid Project. All Rights Reserved.</p>
        </footer>
      </body>
    </html>
  );
}
