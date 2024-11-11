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
        <nav className="flex flex-row items-center justify-between h-[40px] p-4">
          <SidebarTrigger/>
        </nav>
          <div className="flex-grow">{children}</div>
          <footer className="p-3 w-full text-center  bg-[#99DDCC] text-foreground mt-auto" >
            <p>© 2024 IS216 MeetGrid Project. All Rights Reserved.</p>
          </footer>
      </main>
    </SidebarProvider>
  );
}
