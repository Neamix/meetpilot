"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import { useTranslations } from 'next-intl'

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavUser } from "@/components/ui/nav-user"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('Sidebar')
  
  // Generate data with translations
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: t('navigation.playground'),
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: t('subItems.history'),
            url: "#",
          },
          {
            title: t('subItems.starred'),
            url: "#",
          },
          {
            title: t('subItems.settings'),
            url: "#",
          },
        ],
      },
      {
        title: t('navigation.models'),
        url: "#",
        icon: Bot,
        items: [
          {
            title: t('subItems.genesis'),
            url: "#",
          },
          {
            title: t('subItems.explorer'),
            url: "#",
          },
          {
            title: t('subItems.quantum'),
            url: "#",
          },
        ],
      },
      {
        title: t('navigation.documentation'),
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: t('subItems.introduction'),
            url: "#",
          },
          {
            title: t('subItems.getStarted'),
            url: "#",
          },
          {
            title: t('subItems.tutorials'),
            url: "#",
          },
          {
            title: t('subItems.changelog'),
            url: "#",
          },
        ],
      },
      {
        title: t('navigation.settings'),
        url: "#",
        icon: Settings2,
        items: [
          {
            title: t('subItems.general'),
            url: "#",
          },
          {
            title: t('subItems.team'),
            url: "#",
          },
          {
            title: t('subItems.billing'),
            url: "#",
          },
          {
            title: t('subItems.limits'),
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
