import Link from "next/link";
import { NavigationMenuItem } from "../ui/navigation-menu";
import Image from "next/image";

export interface NavigationItem {
    href: string;
    description: string;
    icon?: string; // Optional icon property
}

export function NavigationItem({ href, description, icon }: NavigationItem) {
    return (
        <NavigationMenuItem>
            <Link href={href}> 
                {icon ? (
                    <div className="p-1 inline-flex items-center"> {/* Change to inline-flex */}
                        <Image src={icon} alt={`${description} logo`} className="h-8 w-8" /> {/* Adjust size as needed */}
                        <span className="ml-2 font-bold">{description}</span> {/* Add margin for spacing */}
                    </div>
                ) : (
                    <span>{description}</span>// Show description if no icon
                )}
            </Link>
        </NavigationMenuItem>
    )
}