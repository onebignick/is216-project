"use client"

import * as React from "react"
import {
  Calendar,
  Home,
  MapPin,
  Plus,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./toggle-theme-button"

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Create Interview Plan",
      url: "/event/create",
      icon: Plus,
    },
    {
      title: "Your Interview Plans",
      url: "/event",
      icon: Calendar,
    },
    {
      title: "Register for an Interview",
      url: "/event/register",
      icon: MapPin,
    },
  ],
}


export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex justify-between">
          <SignedIn>
            <UserButton/>
          </SignedIn>
          <ModeToggle/>
        </div>
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarRail />
    </Sidebar>
  )
}
