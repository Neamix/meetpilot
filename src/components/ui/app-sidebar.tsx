"use client"

import * as React from "react"
import Image from "next/image"
import {
  AudioWaveform,
  BookOpen,
  ChartNoAxesColumnIncreasing ,
  Command,
  Frame,
  Bot,
  Handshake,
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
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations('Sidebar')
  const { state } = useSidebar()
  
  // Generate data with translations
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: t('navigation.playground'),
        url: "#",
        icon: ChartNoAxesColumnIncreasing,
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
        {state === "collapsed" ? (
          <Image src="/logo/favicon.png" alt="Logo" width={32} height={32} />
        ) : (
          <Image src="/logo/logo.png" alt="Logo" width={135} height={36} />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
