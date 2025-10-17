import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Bell, User, LogOut, Settings, ShieldCheck, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface AuthorityHeaderProps {
  onLogout: () => void;
  onNavigate?: (page: 'dashboard' | 'settings' | 'notifications' | 'profile') => void;
}

export function AuthorityHeader({ onLogout, onNavigate }: AuthorityHeaderProps) {
  const authorityName = 'Admin Officer';
  const authorityInitials = 'AO';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-slate-900">Authority Dashboard</h1>
            <p className="text-xs text-slate-500">Municipal Management Portal</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {/* Home Button */}
          <Button 
            variant="ghost" 
            size="icon"
            title="Return to Home"
            onClick={() => onNavigate?.('dashboard')}
          >
            <Home className="h-5 w-5 text-slate-600" />
          </Button>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate?.('settings')}
          >
            <Settings className="h-5 w-5 text-slate-600" />
          </Button>

          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => onNavigate?.('notifications')}
          >
            <Bell className="h-5 w-5 text-slate-600" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
              2
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {authorityInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-slate-700">{authorityName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate?.('profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate?.('notifications')}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate?.('dashboard')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Back to Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
