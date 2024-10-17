import { NavigationItem } from "./navigation-item"
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu"
import { ModeToggle } from "@/components/toggle-theme-button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Logo from "@/assets/logo.svg"

export function Navbar({}: React.HTMLAttributes<HTMLElement>) {
	const navigationItems: NavigationItem[] = [ 
		{href: "/", description: "Meetgrid", icon: Logo},
		{href: "/event", description: "Your Events"},
		{href: "/event/create", description: "Create an event"},
		{href: "/event/register", description: "Register"},
		{href: "/", description: "Notes"},
	]
	return (
		<NavigationMenu className="flex justify-between min-w-full h-[60px] px-5 bg-[#B7DFED]">
			<NavigationMenuList className="flex gap-4 justify-start">
				{navigationItems.map((navigationItem: NavigationItem, index: number) => {
					return <NavigationItem key={index} href={navigationItem.href} description={navigationItem.description} icon={navigationItem.icon} />
				})}
			</NavigationMenuList>
			<NavigationMenuList className="flex gap-4 justify-end">
				<ModeToggle />
				<SignedOut>
					<SignInButton />
				</SignedOut>
					<SignedIn>
				<UserButton />
				</SignedIn>
			</NavigationMenuList>
		</NavigationMenu>
	)
}
