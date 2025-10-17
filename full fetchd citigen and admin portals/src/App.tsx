import { useState } from 'react';
import LoginPage from './components/LoginPage';
import AuthorityLoginPage from './components/AuthorityLoginPage';
import CivilianDashboard from './components/CivilianDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Users, ShieldCheck } from 'lucide-react';

type UserRole = 'civilian' | 'authority' | null;

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Role Selection Screen
  if (!isLoggedIn && userRole === null) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-white"
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
            <h1 className="text-slate-900 mb-3">Civic Issue Reporter</h1>
            <p className="text-slate-600 text-lg">Choose your portal to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Civilian Portal */}
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-blue-500"
              onClick={() => setUserRole('civilian')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-slate-900 mb-2">Civilian Portal</h2>
                <p className="text-slate-600 mb-6">
                  Report civic issues, track progress, and view all community reports on the map
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue as Civilian
                </Button>
              </div>
            </Card>

            {/* Authority Portal */}
            <Card className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-cyan-500"
              onClick={() => setUserRole('authority')}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-10 h-10 text-cyan-600" />
                </div>
                <h2 className="text-slate-900 mb-2">Authority Portal</h2>
                <p className="text-slate-600 mb-6">
                  Manage and respond to civic issue reports from your jurisdiction
                </p>
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                  Continue as Authority
                </Button>
              </div>
            </Card>
          </div>

          <div className="text-center mt-8 text-sm text-slate-500">
            <p>© 2025 Civic Issue Reporter. Making our communities better, together.</p>
          </div>
        </div>
      </div>
    );
  }

  // Login Pages
  if (!isLoggedIn) {
    if (userRole === 'civilian') {
      return (
        <LanguageProvider>
          <LoginPage onLogin={() => handleLogin('civilian')} />
        </LanguageProvider>
      );
    } else if (userRole === 'authority') {
      return <AuthorityLoginPage onLogin={() => handleLogin('authority')} />;
    }
  }

  // Dashboards
  return (
    <LanguageProvider>
      {userRole === 'civilian' ? (
        <CivilianDashboard />
      ) : (
        <AuthorityDashboard onLogout={handleLogout} />
      )}
    </LanguageProvider>
  );
}