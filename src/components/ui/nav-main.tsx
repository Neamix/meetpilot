"use client"

import { type LucideIcon,Hash,Users,CalendarDays,Files    } from "lucide-react"
import { useTranslations } from 'next-intl'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuButton>
          <Link className="flex items-center gap-1  w-full" href={'/dashboard'}>
            <Hash width="17px"></Hash>
            <span className="text-[14px]">Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>

      <SidebarMenuButton>
        <Link className="flex items-center gap-1 w-full" href={'/dashboard/teams'}>
          <Users width="17px"></Users>
          <span className="text-[14px]">Teams</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuButton>
        <Link className="flex items-center gap-1  w-full" href={'/dashboard/documents'}>
          <Files width="17px"></Files>
          <span className="text-[14px]">Docs</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuButton>
        <Link className="flex items-center gap-1  w-full" href={'/dashboard/calender'}>
          <CalendarDays width="17px"></CalendarDays>
          <span className="text-[14px]">Calender</span>
        </Link>
      </SidebarMenuButton>
      
    </SidebarGroup>
  )
}
