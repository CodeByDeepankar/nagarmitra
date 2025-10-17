import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Bell, User, LogOut, Menu, HelpCircle, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CURRENT_USER } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';
import { HelpModal } from './HelpModal';

export function DashboardHeader() {
  const { language, setLanguage, t } = useLanguage();
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  
  const userInitials = CURRENT_USER
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const languages = [
    { code: 'en' as const, name: 'English', flag: '🇬🇧' },
    { code: 'es' as const, name: 'Español', flag: '🇪🇸' },
    { code: 'hi' as const, name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
  ];

  return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-slate-900">{t('app.title')}</h1>
            <p className="text-xs text-slate-500 hidden sm:block">{t('app.subtitle')}</p>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title={t('nav.language')}>
                <Languages className="h-5 w-5 text-slate-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{t('nav.language')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={language === lang.code ? 'bg-blue-50' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto text-blue-600">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setHelpModalOpen(true)}
            title={t('nav.help')}
          >
            <HelpCircle className="h-5 w-5 text-slate-600" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative" title={t('nav.notifications')}>
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline text-slate-700">{CURRENT_USER}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t('nav.profile')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t('nav.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                <span>{t('nav.notifications')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('nav.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    {/* Help Modal */}
    <HelpModal open={helpModalOpen} onClose={() => setHelpModalOpen(false)} />
    </>
  );
}
