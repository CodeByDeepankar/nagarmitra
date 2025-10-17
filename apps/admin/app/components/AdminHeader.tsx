"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import { Bell, Settings, LogOut, Home, User } from "lucide-react";

interface AdminHeaderProps {
  notificationCount?: number;
  onNavigate?: (page: string) => void;
}

export function AdminHeader({ notificationCount = 2, onNavigate }: AdminHeaderProps) {
  const adminName = "Admin Officer";
  const adminInitials = "AO";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Authority Dashboard</h1>
            <p className="text-xs text-slate-500">Municipal Management Portal</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('dashboard')}
            title="Home"
          >
            <Home className="h-5 w-5 text-slate-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate?.('settings')}
            title="Settings"
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="relative"
            onClick={() => onNavigate?.('notifications')}
            title="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-600" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs border-2 border-white">
                {notificationCount}
              </Badge>
            )}
          </Button>

          {/* User Badge */}
          <div className="flex items-center gap-2 ml-2 px-3 py-2 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {adminInitials}
            </div>
            <span className="hidden sm:inline text-slate-700 font-medium">{adminName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
