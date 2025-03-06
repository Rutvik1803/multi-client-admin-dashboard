'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Link from 'next/link';
import { useAuth } from '@/context/authContext';

interface SidebarNavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string; // Required permission for access
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  // Define sidebar navigation items based on roles and permissions
  const sidebarNavItems: SidebarNavItem[] =
    user?.role === 'admin'
      ? [{ title: 'Dashboard', href: '/dashboard', icon: User }] // Admin sees only Dashboard
      : [
          {
            title: 'Manage Feedback',
            href: '/dashboard/feedback',
            icon: MessageSquare,
            permission: 'feedback',
          },
          {
            title: 'Products',
            href: '/dashboard/products',
            icon: Package,
            permission: 'products',
          },
          {
            title: 'Settings',
            href: '/dashboard/settings',
            icon: Settings,
            permission: 'settings',
          },
        ];

  // Filter navigation items based on user's permissions
  const filteredNavItems =
    user?.role === 'admin'
      ? sidebarNavItems // Admin sees only Dashboard
      : sidebarNavItems.filter((item) =>
          user?.permissions.includes(item.permission!)
        );

  // Redirect users to their respective allowed pages
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        if (pathname !== '/dashboard') {
          router.push('/dashboard'); // Admins should only be on Dashboard
        }
      } else {
        if (
          pathname === '/dashboard' ||
          !filteredNavItems.some((item) => item.href === pathname)
        ) {
          const firstPage =
            user.permissions.length > 0
              ? `/dashboard/${user.permissions[0]}`
              : '/login';
          router.push(firstPage); // Clients redirected to their first allowed page
        }
      }
    }
  }, [user, pathname, router, filteredNavItems]);

  if (!isMounted || !user) return null;

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <SidebarNav items={filteredNavItems} />
          </SheetContent>
        </Sheet>

        {/* Logo / Dashboard Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <User className="h-6 w-6" />
          <span className="hidden md:inline-block">Admin Dashboard</span>
        </Link>

        {/* Right Header Icons */}
        <div className="ml-auto flex items-center gap-2">
          {/* Notifications */}
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <User className="h-4 w-4" />
                <span className="hidden md:inline-block">{user.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar Navigation (Visible on Desktop) */}
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <SidebarNav items={filteredNavItems} />
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav({ items }: { items: SidebarNavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2 p-4 text-sm font-medium">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
