import { AppSidebar } from "@/components/ui/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RTLToggle } from "@/components/ui/rtl-toggle"
import { getTranslations } from 'next-intl/server'
import { DashboardLayoutInterface } from "@/app/interfaces/LayoutInterfaces"
import { cookies } from "next/headers"

export default async function AdminLayout ({ children }: DashboardLayoutInterface)  {
    const t = await getTranslations('Dashboard.header');
    const cookieStore = await cookies();
    const sidebarStateCookie = cookieStore.get('sidebar_state')?.value
    const sidebarState = (sidebarStateCookie === "true"  || !sidebarStateCookie) ? true : false;

    return (
        <SidebarProvider
            defaultOpen={sidebarState}
        >
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4 flex-1">
                    <SidebarTrigger 
                        className="-ml-1 rtl:-mr-1 rtl:ml-0"
                        aria-label={t('toggleSidebar')}
                        title={t('toggleSidebar')}
                    />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4 rtl:ml-2 rtl:mr-0"
                    />
                    </div>
                    <div className="px-4">
                    <RTLToggle />
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}