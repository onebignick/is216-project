import { cn } from "@/lib/utils";
import { fontSans } from "@/lib/fonts";
import { SidebarLeft } from "@/components/sidebar-left";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SidebarLeft/>
      <main className={cn("flex flex-col min-h-screen bg-background text-foreground font-sans antialiased flex-grow", fontSans.variable)}>
          <SidebarTrigger className="min-h-8 min-w-8 p-4"/>
          {children}
          <footer className="p-4 w-full text-center bg-[#99DDCD]" >
            <p>© 2024 IS216 MeetGrid Project. All Rights Reserved.</p>
          </footer>
      </main>
    </SidebarProvider>
  );
}
