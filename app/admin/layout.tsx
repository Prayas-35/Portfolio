"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAdminAuth } from "@/src/hooks/useAdminAuth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/admin/auth") {
      router.push("/admin/auth");
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (pathname === "/admin/auth") {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black">
      {/* Admin Navigation */}
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-white">
                Admin Panel
              </Link>
              <div className="hidden md:flex space-x-4">
                <NavLink href="/admin" active={pathname === "/admin"}>
                  Dashboard
                </NavLink>
                <NavLink href="/admin/current-project" active={pathname === "/admin/current-project"}>
                  Current Project
                </NavLink>
                <NavLink href="/admin/projects" active={pathname === "/admin/projects"}>
                  Projects
                </NavLink>
                <NavLink href="/admin/experience" active={pathname === "/admin/experience"}>
                  Experience
                </NavLink>
                <NavLink href="/admin/skills" active={pathname === "/admin/skills"}>
                  Skills
                </NavLink>
                <NavLink href="/admin/achievements" active={pathname === "/admin/achievements"}>
                  Achievements
                </NavLink>
                <NavLink href="/admin/findme" active={pathname === "/admin/findme"}>
                  Find Me
                </NavLink>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" target="_blank">
                <Button variant="ghost" className="text-gray-300 hover:text-white">
                  View Site
                </Button>
              </Link>
              <Button
                onClick={logout}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
