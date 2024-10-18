'use client'

import { useState } from "react";
import { NavigationItem } from "./navigation-item";
import { NavigationMenu, NavigationMenuList } from "../ui/navigation-menu";
import { ModeToggle } from "@/components/toggle-theme-button";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Logo from "@/assets/logo.svg";
import { Button } from "../ui/button";

export function Navbar({}: React.HTMLAttributes<HTMLElement>) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage dropdown visibility

	const navigationItems: NavigationItem[] = [
		{ href: "/", description: "Meetgrid", icon: Logo },
		{ href: "/event", description: "Your Events" },
		{ href: "/event/create", description: "Create an event" },
		{ href: "/event/register", description: "Register" },
		{ href: "/", description: "Notes" },
	];

	const toggleDropdown = () => {
		setIsDropdownOpen((prev) => !prev);
	};


	return (
		<div>
			<NavigationMenu className="flex justify-between max-w-7xl min-w-full h-[60px] px-5 bg-primary ">
				<NavigationMenuList className="flex gap-4 sm:items-stretch sm:justify-start">

					{/* Mobile menu button - only show on small screens */}
					{/* // Hide on medium screens and above */}
					{/* // Toggle dropdown on button click */}
					<Button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden" aria-controls="mobile-menu" aria-expanded={isDropdownOpen} onClick={toggleDropdown}>
					<span className="absolute -inset-0.5"></span>
					<span className="sr-only">Open main menu</span>

					{/* Icon when menu is closed */}
					{/* // Hide when open */}
					<svg className={`block h-6 w-6 ${isDropdownOpen ? "hidden" : "block"} text-gray-800`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
						<path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
					</svg>
					{/* Icon when menu is open */}
					{/* // Show when open */}
					<svg className={`block h-6 w-6 ${isDropdownOpen ? "block" : "hidden"} text-gray-800`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
						<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
					</svg>
					</Button>

					{/* Render navigation items for medium and larger screens */}
					<div className="hidden md:flex gap-4"> {/* Hide on small screens */}
					{navigationItems.map((navigationItem: NavigationItem, index: number) => (
						<NavigationItem key={index} href={navigationItem.href} description={navigationItem.description} icon={navigationItem.icon}/>
					))}
					</div>
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
			{/* Dropdown Menu for Small Screens */}
			{isDropdownOpen && (
				<ul className="list-none"> {/* Remove bullet points here */}
					<div className="absolute top-12 left-0 w-full bg-primary z-10 min-w-full">
						{navigationItems.map((navigationItem: NavigationItem, index: number) => (
							<NavigationItem key={index} href={navigationItem.href} description={navigationItem.description} icon={navigationItem.icon}/>
						))}
					</div>
				</ul>
			)}
		</div>
	);
}
