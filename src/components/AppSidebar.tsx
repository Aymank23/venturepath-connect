import {
  LayoutDashboard, FileText, Users, ClipboardCheck, Award,
  Settings, BarChart3, UserCheck, BookOpen, Target, Briefcase
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import lauLogo from '@/assets/lau-aksob-logo.png';

const navConfig: Record<string, { title: string; url: string; icon: any }[]> = {
  applicant: [
    { title: 'Dashboard', url: '/app/dashboard', icon: LayoutDashboard },
    { title: 'My Application', url: '/app/application', icon: FileText },
    { title: 'Documents', url: '/app/documents', icon: Briefcase },
    { title: 'Status', url: '/app/status', icon: Target },
  ],
  reviewer: [
    { title: 'Dashboard', url: '/app/reviewer', icon: LayoutDashboard },
    { title: 'Applications', url: '/app/reviewer/applications', icon: FileText },
  ],
  mentor: [
    { title: 'Dashboard', url: '/app/mentor', icon: LayoutDashboard },
    { title: 'Participants', url: '/app/mentor/participants', icon: Users },
    { title: 'Mentorship Logs', url: '/app/mentor/logs', icon: BookOpen },
    { title: 'Outcomes', url: '/app/mentor/outcomes', icon: Target },
  ],
  admin: [
    { title: 'Dashboard', url: '/app/admin', icon: LayoutDashboard },
    { title: 'Applications', url: '/app/admin/applications', icon: FileText },
    { title: 'Decisions', url: '/app/admin/decisions', icon: ClipboardCheck },
    { title: 'Reviews', url: '/app/admin/reviews', icon: UserCheck },
    { title: 'Mentorship', url: '/app/admin/mentorship', icon: Award },
    { title: 'Reports', url: '/app/admin/reports', icon: BarChart3 },
    { title: 'Settings', url: '/app/admin/settings', icon: Settings },
  ],
};

export function AppSidebar() {
  const { activeRole } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const items = navConfig[activeRole || 'applicant'] || [];

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b">
          {!collapsed ? (
            <img src={lauLogo} alt="LAU AKSOB" className="h-8 object-contain" />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
              <span className="text-primary-foreground font-bold text-xs">LAU</span>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="font-heading">
            {!collapsed && (activeRole ? activeRole.charAt(0).toUpperCase() + activeRole.slice(1) : 'Navigation')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end={item.url === '/app/dashboard'} className="hover:bg-accent/50" activeClassName="bg-accent text-accent-foreground font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
