"use client"

import * as React from "react"
import {
  Calendar,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  MapPin,
  Plus,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SignedIn, UserButton } from "@clerk/nextjs"
import { ModeToggle } from "./toggle-theme-button"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
      isActive: true,
    },
    {
      title: "Create an Event",
      url: "/event/create",
      icon: Plus,
    },
    {
      title: "Your Events",
      url: "/event",
      icon: Calendar,
    },
    {
      title: "Register",
      url: "/event/register",
      icon: MapPin,
    },
    {
      title: "Notes",
      url: "/event/notes/view-notes",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "meeting 1",
      url: "#",
      emoji: "📊",
    },
    {
      name: "meeting 2",
      url: "#",
      emoji: "🍳",
    },
    {
      name: "meeting 3",
      url: "#",
      emoji: "💪",
    },
  ],
  events: [
    {
      name: "Personal Life Management",
      emoji: "🏠",
      pages: [
        {
          name: "Daily Journal & Reflection",
          url: "#",
          emoji: "📔",
        },
        {
          name: "Health & Wellness Tracker",
          url: "#",
          emoji: "🍏",
        },
        {
          name: "Personal Growth & Learning Goals",
          url: "#",
          emoji: "🌟",
        },
      ],
    },
    {
      name: "Professional Development",
      emoji: "💼",
      pages: [
        {
          name: "Career Objectives & Milestones",
          url: "#",
          emoji: "🎯",
        },
        {
          name: "Skill Acquisition & Training Log",
          url: "#",
          emoji: "🧠",
        },
        {
          name: "Networking Contacts & Events",
          url: "#",
          emoji: "🤝",
        },
      ],
    },
    {
      name: "Creative Projects",
      emoji: "🎨",
      pages: [
        {
          name: "Writing Ideas & Story Outlines",
          url: "#",
          emoji: "✍️",
        },
        {
          name: "Art & Design Portfolio",
          url: "#",
          emoji: "🖼️",
        },
        {
          name: "Music Composition & Practice Log",
          url: "#",
          emoji: "🎵",
        },
      ],
    },
    {
      name: "Home Management",
      emoji: "🏡",
      pages: [
        {
          name: "Household Budget & Expense Tracking",
          url: "#",
          emoji: "💰",
        },
        {
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          emoji: "🔧",
        },
        {
          name: "Family Calendar & Event Planning",
          url: "#",
          emoji: "📅",
        },
      ],
    },
    {
      name: "Travel & Adventure",
      emoji: "🧳",
      pages: [
        {
          name: "Trip Planning & Itineraries",
          url: "#",
          emoji: "🗺️",
        },
        {
          name: "Travel Bucket List & Inspiration",
          url: "#",
          emoji: "🌎",
        },
        {
          name: "Travel Journal & Photo Gallery",
          url: "#",
          emoji: "📸",
        },
      ],
    },
  ],
}

interface SidebarComponent {
  name: string;
  url: string;
}

export function SidebarLeft({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [meetingData, setMeetingData] = React.useState<SidebarComponent[]>([]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      const res = await fetch("/api/event/user");
      const result = await res.json();

      const newMeetingData: SidebarComponent[] = [];

      const organizedEvents = result.result[0].organizedEvents;
      for(let i=0;i<organizedEvents.length;i++) {
        newMeetingData.push({
          name: organizedEvents[i].name,
          url: "/event/"+organizedEvents[i].id,
        } as SidebarComponent);
      }

      const adminEvents = result.result[0].adminEvents;
      for(let i=0;i<adminEvents.length;i++) {
        newMeetingData.push({
          name: adminEvents[i].name,
          url: "/event/"+adminEvents[i].id,
        } as SidebarComponent)
      }

      setMeetingData(newMeetingData);
      return result;
    }
    fetchUserData();
  }, [])

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
      <SidebarContent>
        <NavFavorites favorites={meetingData} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
