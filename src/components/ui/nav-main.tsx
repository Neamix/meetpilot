"use client"

import { ChevronRight, type LucideIcon,Hash,Users,CalendarDays,Files    } from "lucide-react"
import { useTranslations } from 'next-intl'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const t = useTranslations('Sidebar')
  
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuButton>
          <Hash></Hash>
          <span>Dashboard</span>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>

      <SidebarMenuButton>
        <Users></Users>
        <span>Teams</span>
      </SidebarMenuButton>

      <SidebarMenuButton>
        <Files></Files>
        <span>Docs</span>
      </SidebarMenuButton>

      <SidebarMenuButton>
        <CalendarDays></CalendarDays>
        <span>Calenders</span>
      </SidebarMenuButton>
      
    </SidebarGroup>
  )
}
