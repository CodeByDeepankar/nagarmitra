import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', loginData);
    // Simulate successful login
    onLogin();
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup data:', signupData);
    // Simulate successful signup and auto-login
    onLogin();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
      </div>

      {/* Civic-themed background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="civic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#civic-grid)" />
        </svg>
      </div>

      <div className="w-full max-w-md px-6 relative z-10">
        {/* Logo placeholder */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
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
          <h1 className="text-slate-800 text-center mb-2">Civic Issue Reporter</h1>
          <p className="text-slate-500 text-center text-sm">Report, Track, Resolve Community Issues</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-slate-200">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="px-6 pb-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-slate-700">
                    Email ID
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center text-slate-600 cursor-pointer">
                    <input type="checkbox" className="mr-2 rounded border-slate-300" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  Login
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup" className="px-6 pb-6">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-slate-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({ ...signupData, name: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-slate-700">
                    Email ID
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({ ...signupData, email: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a strong password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({ ...signupData, password: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone" className="text-slate-700">
                    Phone Number <span className="text-slate-400">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={signupData.phone}
                      onChange={(e) =>
                        setSignupData({ ...signupData, phone: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-location" className="text-slate-700">
                    Location <span className="text-slate-400">(Optional)</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="signup-location"
                      type="text"
                      placeholder="City, State"
                      value={signupData.location}
                      onChange={(e) =>
                        setSignupData({ ...signupData, location: e.target.value })
                      }
                      className="pl-11 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <label className="flex items-start cursor-pointer">
                    <input type="checkbox" className="mr-2 mt-0.5 rounded border-slate-300" required />
                    <span>
                      I agree to the{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-blue-600 hover:text-blue-700">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                >
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-slate-500 mt-6">
          Need help? <a href="#" className="text-blue-600 hover:text-blue-700">Contact Support</a>
        </p>
      </div>
    </div>
  );
}
