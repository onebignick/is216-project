import { Navbar } from "@/components/navbar/navbar";
import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { ModeToggle } from "@/components/toggle-theme-button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

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
          <div className="flex flex-row gap-4">
            <ModeToggle />
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
