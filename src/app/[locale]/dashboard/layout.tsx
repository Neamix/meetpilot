import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { RTLToggle } from "@/components/ui/rtl-toggle"
export default function AdminLayout ({ children }: { children: React.ReactNode })  {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4 rtl:flex-row-reverse flex-1">
                <SidebarTrigger className="-ml-1 rtl:-mr-1 rtl:ml-0" />
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