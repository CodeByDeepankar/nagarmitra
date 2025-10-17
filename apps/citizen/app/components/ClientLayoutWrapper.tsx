"use client";

import { LanguageProvider } from '../contexts/LanguageContext';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
