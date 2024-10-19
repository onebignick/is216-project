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
      <body className={cn("flex flex-col min-h-screen bg-background text-foreground font-sans antialiased", fontSans.variable)}>
        <Navbar className="mx-6" />
        <main className="flex-grow">
          {children}
        </main>
        {/* Footer Section */}
        <footer className="p-4 w-full text-center bg-[#99DDCD]">
          <p>© 2024 IS216 MeetGrid Project. All Rights Reserved.</p>
        </footer>
      </body>
    </html>
  );
}
