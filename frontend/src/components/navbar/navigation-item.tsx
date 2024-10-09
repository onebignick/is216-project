import Link from "next/link";
import { NavigationMenuItem } from "../ui/navigation-menu";

export interface NavigationItem {
    href: string;
    description: string;
}

export function NavigationItem({ href, description }: NavigationItem) {
    return (
        <NavigationMenuItem>
            <Link href={href}>{description}</Link>
        </NavigationMenuItem>
    )
}