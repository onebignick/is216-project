"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import {
  Calendar,
  Home,
  MapPin,
  Plus,
} from "lucide-react"


import {
  Sidebar,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
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
  const [selectedLink, setSelectedLink] = useState("")

  useEffect(() => {
    // Set initial selected link based on current URL
    setSelectedLink(window.location.pathname)
  }, [])

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader className="bg-[#FEF4E6]" >
        <div className="flex justify-between">
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonPopoverCard: { pointerEvents: 'initial',  }, }, }}/>
          </SignedIn>
          <SignedOut>
            <SignInButton/>
          </SignedOut>
          <ModeToggle/>
        </div>
        {/* <NavMain items={data.navMain} /> */}
      </SidebarHeader>

         {/* Sidebar Middle Section - apply beige color */}
      <div className="bg-[#FEF4E6] flex-grow">
        {data.navMain.map((item) => (
          <a
            key={item.url}
            href={item.url}
            onClick={() => setSelectedLink(item.title)}
            className={`flex items-center p-3 text-md ${
              selectedLink === item.url
              ? "bg-[#E0CBBF] text-black" // Darker shade for the active tab
                : "text-gray-700 hover:bg-[#FEF4E6]"
            }`}
          >
            <item.icon className="mr-2" />
            <span>{item.title}</span>
          </a>
        ))}
      </div>

      <SidebarRail className="bg-[#FEF4E6]"/>
    </Sidebar>
  )
}
