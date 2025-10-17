"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Search,
  Users
} from "lucide-react";
import { Input } from "../components/ui/input";
import IssueDetailModal from "./IssueDetailModal";
import DashboardStats from "../components/DashboardStats";
import { MapView } from "../components/MapView";
import { DashboardHeader } from "../components/DashboardHeader";

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
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState('my-reports');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIssue(null);
  };

  const handleIssueUpdated = () => {
    fetchIssues();
  };

  const stats = {
    total: issues.length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    pending: issues.filter(i => i.status === 'Pending').length,
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'resolved') return matchesSearch && issue.status === 'Resolved';
    if (statusFilter === 'in-progress') return matchesSearch && issue.status === 'In Progress';
    if (statusFilter === 'pending') return matchesSearch && issue.status === 'Pending';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Dashboard Header */}
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome to Your Dashboard</h1>
          <p className="text-gray-600">
            Track and manage all your civic issues
          </p>
        </div>

        {/* Enhanced Stats Component */}
        <div className="mb-8">
          <DashboardStats
            totalReports={stats.total}
            pending={stats.pending}
            inProgress={stats.inProgress}
            resolved={stats.resolved}
          />
        </div>

        {/* Main Tabs: My Reports & Map View */}
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="mb-6 bg-white shadow-sm">
            <TabsTrigger value="my-reports" className="gap-2 px-6">
              <FileText className="w-4 h-4" />
              My Reports
            </TabsTrigger>
            <TabsTrigger value="map-view" className="gap-2 px-6">
              <Map className="w-4 h-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          {/* My Reports Tab */}
          <TabsContent value="my-reports" className="mt-0">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
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

                {/* Status Filter Tabs */}
                <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all" className="gap-2">
                      All ({stats.total})
                    </TabsTrigger>
                    <TabsTrigger value="resolved" className="gap-2">
                      Resolved ({stats.resolved})
                    </TabsTrigger>
                    <TabsTrigger value="in-progress" className="gap-2">
                      In Progress ({stats.inProgress})
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2">
                      Pending ({stats.pending})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent>
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
                      <Button 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => router.push('/report')}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Report a Problem
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                      <Card 
                        key={issue.id}
                        onClick={() => handleIssueClick(issue)}
                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.01] overflow-hidden"
                      >
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
                              {issue.complaint_count && issue.complaint_count > 1 && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 flex-shrink-0" />
                                  <span>{issue.complaint_count} people reported</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 text-blue-600 font-medium ml-auto">
                                <Eye className="w-4 h-4" />
                                <span>View Details</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map View Tab */}
          <TabsContent value="map-view" className="mt-0">
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl">Map View</CardTitle>
                <CardDescription>
                  View all your reported issues on the map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MapView />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Report Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          size="lg"
          className="bg-red-500 hover:bg-red-600 shadow-2xl h-16 px-6 text-base font-semibold rounded-full group"
          onClick={() => router.push('/report')}
        >
          <Plus className="w-6 h-6 mr-2 group-hover:rotate-90 transition-transform" />
          Report a Problem
        </Button>
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onIssueUpdated={handleIssueUpdated}
      />
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
