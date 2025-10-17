"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import ProtectedRoute from "../components/ProtectedRoute";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  Plus, 
  FileText, 
  Map, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  Eye,
  Filter,
  Search
} from "lucide-react";
import { Input } from "../components/ui/input";

const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'pending';
    case 'In Progress':
      return 'progress';
    case 'Resolved':
      return 'resolved';
    default:
      return 'default';
  }
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    pothole: 'bg-orange-100 text-orange-800 border-orange-200',
    streetlight: 'bg-blue-100 text-blue-800 border-blue-200',
    drainage: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    garbage: 'bg-purple-100 text-purple-800 border-purple-200',
    'water-supply': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    water: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    other: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[category] || colors.other;
};

function DashboardPageContent() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchIssues() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('issues')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error(error);
        } else {
          setIssues((data || []) as Issue[]);
        }
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    pending: issues.filter(i => i.status === 'Pending').length,
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'resolved') return matchesSearch && issue.status === 'Resolved';
    if (activeTab === 'in-progress') return matchesSearch && issue.status === 'In Progress';
    if (activeTab === 'pending') return matchesSearch && issue.status === 'Pending';
    return matchesSearch;
  });

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.total,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-l-4 border-blue-600',
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-l-4 border-green-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-l-4 border-yellow-600',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-l-4 border-red-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
              <p className="text-gray-600">
                Track and manage all your reported civic issues
              </p>
            </div>
            <Link href="/report">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Report New Issue
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className={`${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">My Reports</CardTitle>
                <CardDescription>
                  View and filter all your submitted civic issue reports
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all" className="gap-2">
                  <FileText className="w-4 h-4" />
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Resolved ({stats.resolved})
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="gap-2">
                  <Clock className="w-4 h-4" />
                  In Progress ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Pending ({stats.pending})
                </TabsTrigger>
              </TabsList>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Loading your reports...</p>
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {searchQuery ? 'No reports found' : 'No reports yet'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery 
                      ? 'Try adjusting your search terms' 
                      : 'Start by reporting your first civic issue'}
                  </p>
                  {!searchQuery && (
                    <Link href="/report">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Report an Issue
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <Link key={issue.id} href={`/issues/${issue.id}`}>
                      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden border-l-4 border-l-blue-600">
                        <div className="flex flex-col md:flex-row">
                          {issue.image_url && (
                            <div className="w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                              <img
                                src={issue.image_url}
                                alt={issue.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-semibold text-gray-900 pr-4 line-clamp-2">
                                {issue.title}
                              </h3>
                              <Badge className={
                                issue.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                                issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                'bg-red-100 text-red-800 border-red-200'
                              }>
                                {issue.status}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {issue.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge 
                                variant="outline" 
                                className={getCategoryColor(issue.category)}
                              >
                                {issue.category.replace('-', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              {issue.location && typeof issue.location === 'object' && !Array.isArray(issue.location) && 'address' in issue.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span className="line-clamp-1">
                                    {String(issue.location.address).substring(0, 50)}
                                    {String(issue.location.address).length > 50 ? '...' : ''}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span>
                                  {new Date(issue.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-blue-600 font-medium ml-auto">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardPageContent />
    </ProtectedRoute>
  );
}
