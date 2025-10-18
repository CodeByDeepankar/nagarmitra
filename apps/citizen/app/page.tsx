"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { supabase } from "@repo/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Camera, 
  TrendingUp,
  Building2,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  Zap
} from "lucide-react";

interface IssuesSummary {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

type IssueRecord = {
  status: string | null;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [issuesSummary, setIssuesSummary] = useState<IssuesSummary | null>(null);

  useEffect(() => {
    async function loadUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: issues } = await supabase
          .from('issues')
          .select('status')
          .eq('user_id', user.id);

        if (issues && issues.length > 0) {
          const typedIssues = issues as IssueRecord[];
          setIssuesSummary({
            total: typedIssues.length,
            pending: typedIssues.filter((issue) => issue.status === 'Pending').length,
            inProgress: typedIssues.filter((issue) => issue.status === 'In Progress').length,
            resolved: typedIssues.filter((issue) => issue.status === 'Resolved').length,
          });
        }
      }
  // No loading indicator on landing page, so nothing to update here.
    }
    loadUserData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Shield className="w-4 h-4 mr-1" />
              Empowering Citizens Since 2024
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
              Welcome to Nagar Mitra
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Your voice matters! Report civic issues in your neighborhood and track their resolution in real-time.
              Together, we can make our city cleaner, safer, and better.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/report">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 group w-full sm:w-auto"
                >
                  <Camera className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Report an Issue
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {user && (
                <Link href="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    View My Issues
                  </Button>
                </Link>
              )}
              {!user && (
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats Bar */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">2,847</div>
                <div className="text-sm text-blue-100 mt-1">Issues Reported</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">2,103</div>
                <div className="text-sm text-blue-100 mt-1">Issues Resolved</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">1,234</div>
                <div className="text-sm text-blue-100 mt-1">Active Citizens</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl md:text-4xl font-bold">73%</div>
                <div className="text-sm text-blue-100 mt-1">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="mb-4">How It Works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Fast, and Effective
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three easy steps to make a difference in your community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl">1. Report with Photo</CardTitle>
              <CardDescription className="text-base">
                Capture the issue with photos and GPS location for accurate reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>High-quality image upload</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automatic GPS location capture</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Category-based classification</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-t-4 border-indigo-600">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl">2. Track Location</CardTitle>
              <CardDescription className="text-base">
                Pinpoint exact locations to help authorities address issues faster
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time GPS coordinates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Human-readable addresses</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Interactive map view</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-t-4 border-purple-600">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-xl">3. Monitor Progress</CardTitle>
              <CardDescription className="text-base">
                Track the status of your reports from pending to resolved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Real-time status updates</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Progress notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Resolution timeline</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* User Dashboard Preview */}
        {user && issuesSummary && (
          <Card className="max-w-5xl mx-auto bg-gradient-to-br from-white to-blue-50 shadow-xl border-2 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Your Issues Dashboard</CardTitle>
                  <CardDescription className="text-base">
                    Track all your reported issues in one place
                  </CardDescription>
                </div>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    View Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{issuesSummary.total}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Issues</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-yellow-600">{issuesSummary.pending}</div>
                  <div className="text-sm text-gray-600 mt-1">Pending</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{issuesSummary.inProgress}</div>
                  <div className="text-sm text-gray-600 mt-1">In Progress</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{issuesSummary.resolved}</div>
                  <div className="text-sm text-gray-600 mt-1">Resolved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of citizens working together to improve our community
          </p>
          <Link href="/report">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Camera className="w-5 h-5 mr-2" />
              Report Your First Issue
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Nagar Mitra
              </h3>
              <p className="text-sm text-slate-400">
                Empowering citizens to create cleaner, safer, and better communities through civic engagement.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/report" className="hover:text-white transition-colors">Report Issue</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/auth/signin" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  support@nagarmitra.in
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 1234567890
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 Nagar Mitra. All rights reserved. Making cities better, together.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
