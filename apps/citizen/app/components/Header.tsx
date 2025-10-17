import React from 'react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">🎯</span>
          </div>
          <h1 className="text-xl font-semibold">Gamified STEM Learning</h1>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:text-blue-200 transition-colors">Home</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Student</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Teacher</a>
          <a href="#" className="hover:text-blue-200 transition-colors">Contact</a>
          <Button variant="outline" size="sm" className="text-blue-600 border-white hover:bg-white/10">
            Light
          </Button>
        </nav>
      </div>
    </header>
  );
}