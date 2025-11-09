"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const sections = [
    {
      title: "Current Project",
      description: "Update what you're working on now",
      href: "/admin/current-project",
      icon: "🔥",
      color: "from-orange-500 to-red-700",
    },
    {
      title: "Projects",
      description: "Manage your portfolio projects",
      href: "/admin/projects",
      icon: "🚀",
      color: "from-blue-500 to-blue-700",
    },
    {
      title: "Experience",
      description: "Add and edit work experience",
      href: "/admin/experience",
      icon: "💼",
      color: "from-green-500 to-green-700",
    },
    {
      title: "Skills",
      description: "Manage your technical skills",
      href: "/admin/skills",
      icon: "⚡",
      color: "from-purple-500 to-purple-700",
    },
    {
      title: "Achievements",
      description: "Track your achievements",
      href: "/admin/achievements",
      icon: "🏆",
      color: "from-yellow-500 to-yellow-700",
    },
    {
      title: "Find Me",
      description: "Manage event appearances",
      href: "/admin/findme",
      icon: "📍",
      color: "from-pink-500 to-pink-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Link key={section.href} href={section.href}>
            <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800 hover:border-gray-700 transition-all hover:scale-105 cursor-pointer h-full">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl mb-4`}>
                  {section.icon}
                </div>
                <CardTitle className="text-white">{section.title}</CardTitle>
                <CardDescription className="text-gray-400">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full text-gray-300 hover:text-white">
                  Manage →
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="bg-gray-900/50 backdrop-blur-xl border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Quick Stats</CardTitle>
          <CardDescription className="text-gray-400">
            Overview of your portfolio content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard label="Projects" value="0" />
            <StatCard label="Experience" value="0" />
            <StatCard label="Skills" value="0" />
            <StatCard label="Achievements" value="0" />
            <StatCard label="Events" value="0" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-800/50 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}
