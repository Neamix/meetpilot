"use client"

import { Hash,Users,CalendarDays,Files } from "lucide-react"
import { useTranslations } from 'next-intl'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"

export function NavMain() {
  const t = useTranslations('Sidebar')
  const state = useSidebar();
  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuButton>
          <Link className="flex items-center gap-1  w-full" href={'/dashboard'}>
            <Hash width="17px"></Hash>
            <span className={`text-[14px] ${state.open ? '' : 'hidden'}`}>Dashboard</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenu>
      <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>

      <SidebarMenuButton>
        <Link className="flex items-center gap-1 w-full" href={'/dashboard/teams'}>
          <Users width="17px"></Users>
          <span className={`text-[14px] ${state.open ? '' : 'hidden'}`}>Teams</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuButton>
        <Link className="flex items-center gap-1  w-full" href={'/dashboard/documents'}>
          <Files width="17px"></Files>
          <span className={`text-[14px] ${state.open ? '' : 'hidden'}`}>Docs</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuButton>
        <Link className="flex items-center gap-1  w-full" href={'/dashboard/calender'}>
          <CalendarDays width="17px"></CalendarDays>
          <span className={`text-[14px] ${state.open ? '' : 'hidden'}`}>Calender</span>
        </Link>
      </SidebarMenuButton>
      

    </SidebarGroup>
  )
}
