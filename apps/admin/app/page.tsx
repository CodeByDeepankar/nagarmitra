"use client";

import { useState, useEffect } from "react";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import { AdminHeader } from "./components/AdminHeader";
import { IssueDetailModal } from "./components/IssueDetailModal";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { Badge } from "@repo/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  XCircle,
  MapPin,
  Calendar,
  Eye,
  User,
  Search,
  LayoutDashboard,
  Plus,
  Map,
  BarChart3,
  Building2,
  Users as UsersIcon,
  Bell
} from "lucide-react";

type TabType = "overview" | "new" | "map" | "analytics" | "departments" | "staff" | "alerts";

export default function AdminDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === "Pending").length,
    inProgress: issues.filter(i => i.status === "In Progress").length,
    resolved: issues.filter(i => i.status === "Resolved").length,
    rejected: issues.filter(i => i.status === "Rejected").length,
    highPriority: issues.filter(i => i.priority === "high").length,
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, selectedStatus, searchQuery]);

  async function fetchIssues() {
    try {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  }

  function filterIssues() {
    let filtered = issues;

    if (selectedStatus !== "all") {
      filtered = filtered.filter(issue => issue.status === selectedStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (issue.location?.toString() || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredIssues(filtered);
  }

  async function handleUpdateIssue(issueId: string, updates: Partial<Issue>) {
    try {
      console.log("Updating issue:", issueId);
      console.log("Updates object:", JSON.stringify(updates, null, 2));
      console.log("Update keys:", Object.keys(updates));
      
      const { data, error } = await supabase
        .from("issues")
        .update(updates)
        .eq("id", issueId)
        .select();

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        });
        throw new Error(error.message || "Failed to update issue");
      }

      console.log("Update successful:", data);

      // Update local state
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.id === issueId ? { ...issue, ...updates } : issue
        )
      );

      // Close modal
      setSelectedIssue(null);
      
      alert("Issue updated successfully!");
    } catch (error) {
      console.error("Error updating issue:", error);
      alert(`Failed to update issue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-orange-100 text-orange-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Category distribution for pie chart
  const categoryData = [
    { name: "Streetlights", value: Math.floor(issues.length * 0.17), color: "#8B5CF6", percentage: "17%" },
    { name: "Drainage", value: Math.floor(issues.length * 0.17), color: "#EC4899", percentage: "17%" },
    { name: "Garbage", value: Math.floor(issues.length * 0.17), color: "#F59E0B", percentage: "17%" },
    { name: "Potholes", value: Math.floor(issues.length * 0.17), color: "#3B82F6", percentage: "17%" },
    { name: "Road Damage", value: Math.floor(issues.length * 0.17), color: "#10B981", percentage: "17%" },
    { name: "Water Supply", value: Math.floor(issues.length * 0.17), color: "#06B6D4", percentage: "17%" },
  ];

  // Month labels for trend chart
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const totalReportsData = [12, 14, 13, 15, 14, 16];
  const resolvedReportsData = [10, 11, 11, 12, 12, 13];

  function renderOverviewTab() {
    return (
      <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Reports</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">In Progress</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">Rejected</p>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-2">High Priority</p>
                  <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reports Section */}
        <Card className="bg-white border-0 shadow-sm">
          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">All Reports</h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter Pills */}
            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => setSelectedStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({issues.length})
              </button>
              <button
                onClick={() => setSelectedStatus("Pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === "Pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setSelectedStatus("In Progress")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === "In Progress"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setSelectedStatus("Resolved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === "Resolved"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Resolved ({stats.resolved})
              </button>
              <button
                onClick={() => setSelectedStatus("Rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === "Rejected"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected ({stats.rejected})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Details</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted By</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">Loading reports...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No reports found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue, index) => (
                    <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {issue.image_url && (
                            <img
                              src={issue.image_url}
                              alt={issue.title}
                              className="w-14 h-14 rounded-lg object-cover border border-gray-200"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {issue.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {issue.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-medium">{issue.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-[200px]">
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-600 truncate">{issue.location?.toString() || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-900">{issue.user_id || "Anonymous"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(issue.status)}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </>
    );
  }

  function renderAnalyticsTab() {
    return (
      <>
        {/* Analytics Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
          <p className="text-gray-600 mt-1">Visual insights and performance metrics</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Reports by Category - Pie Chart */}
          <Card className="bg-white border-0 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports by Category</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {categoryData.map((item, index) => {
                    const total = categoryData.reduce((sum, d) => sum + d.value, 0);
                    let currentAngle = 0;
                    const angles = categoryData.map(d => {
                      const angle = (d.value / total) * 360;
                      const result = { start: currentAngle, angle };
                      currentAngle += angle;
                      return result;
                    });
                    
                    const angleData = angles[index];
                    if (!angleData) return null;
                    
                    const { start, angle } = angleData;
                    const startAngle = (start - 90) * (Math.PI / 180);
                    const endAngle = (start + angle - 90) * (Math.PI / 180);
                    
                    const x1 = 100 + 80 * Math.cos(startAngle);
                    const y1 = 100 + 80 * Math.sin(startAngle);
                    const x2 = 100 + 80 * Math.cos(endAngle);
                    const y2 = 100 + 80 * Math.sin(endAngle);
                    
                    const largeArc = angle > 180 ? 1 : 0;
                    
                    return (
                      <path
                        key={item.name}
                        d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={item.color}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {categoryData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-700">{item.name}: {item.percentage}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Reports by Status - Bar Chart */}
          <Card className="bg-white border-0 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports by Status</h3>
            <div className="h-64 flex items-end justify-around gap-4 px-4">
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-red-500 rounded-t-lg transition-all hover:bg-red-600" style={{ height: `${(stats.pending / stats.total) * 100}%`, minHeight: "40px" }}></div>
                <div className="mt-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  <p className="text-xs text-gray-600 mt-1">Pending</p>
                </div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-yellow-500 rounded-t-lg transition-all hover:bg-yellow-600" style={{ height: `${(stats.inProgress / stats.total) * 100}%`, minHeight: "40px" }}></div>
                <div className="mt-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                  <p className="text-xs text-gray-600 mt-1">In Progress</p>
                </div>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600" style={{ height: `${(stats.resolved / stats.total) * 100}%`, minHeight: "40px" }}></div>
                <div className="mt-3 text-center">
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                  <p className="text-xs text-gray-600 mt-1">Resolved</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Monthly Trend - Line Chart */}
        <Card className="bg-white border-0 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trend</h3>
          <div className="h-80">
            <div className="relative h-full">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500 w-8">
                <span>24</span>
                <span>21</span>
                <span>18</span>
                <span>15</span>
                <span>12</span>
                <span>9</span>
                <span>6</span>
                <span>3</span>
                <span>0</span>
              </div>
              
              {/* Chart area */}
              <div className="ml-12 h-full pb-12">
                <svg viewBox="0 0 600 300" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <line
                      key={i}
                      x1="0"
                      y1={i * 37.5}
                      x2="600"
                      y2={i * 37.5}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Total Reports Line */}
                  <polyline
                    points={totalReportsData.map((val, i) => `${i * 120},${300 - (val / 24) * 300}`).join(" ")}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    className="transition-all"
                  />
                  {totalReportsData.map((val, i) => (
                    <circle
                      key={`total-${i}`}
                      cx={i * 120}
                      cy={300 - (val / 24) * 300}
                      r="5"
                      fill="#3B82F6"
                      className="hover:r-7 transition-all cursor-pointer"
                    />
                  ))}
                  
                  {/* Resolved Reports Line */}
                  <polyline
                    points={resolvedReportsData.map((val, i) => `${i * 120},${300 - (val / 24) * 300}`).join(" ")}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    className="transition-all"
                  />
                  {resolvedReportsData.map((val, i) => (
                    <circle
                      key={`resolved-${i}`}
                      cx={i * 120}
                      cy={300 - (val / 24) * 300}
                      r="5"
                      fill="#10B981"
                      className="hover:r-7 transition-all cursor-pointer"
                    />
                  ))}
                </svg>
                
                {/* X-axis labels */}
                <div className="flex justify-around mt-2 text-xs text-gray-500">
                  {monthLabels.map(month => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-500 rounded"></div>
                <span className="text-sm text-gray-700">Total Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-700">Resolved</span>
              </div>
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Authority Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all civic issue reports from your jurisdiction</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "new"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Plus className="w-4 h-4" />
              New
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">2</Badge>
            </button>
            <button
              onClick={() => setActiveTab("map")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "map"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Map className="w-4 h-4" />
              Map
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("departments")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "departments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Departments
            </button>
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "staff"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              Staff
            </button>
            <button
              onClick={() => setActiveTab("alerts")}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === "alerts"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              <Bell className="w-4 h-4" />
              Alerts
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">3</Badge>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">{renderOverviewTab()}</div>
        )}
        {activeTab === "analytics" && (
          <div className="space-y-8">{renderAnalyticsTab()}</div>
        )}
        {activeTab === "new" && (
          <div className="text-center py-12">
            <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">New Reports</h3>
            <p className="text-gray-600">View and manage newly submitted reports</p>
          </div>
        )}
        {activeTab === "map" && (
          <div className="text-center py-12">
            <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Visualize all reports on an interactive map</p>
          </div>
        )}
        {activeTab === "departments" && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Departments</h3>
            <p className="text-gray-600">Manage departments and their responsibilities</p>
          </div>
        )}
        {activeTab === "staff" && (
          <div className="text-center py-12">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Staff Management</h3>
            <p className="text-gray-600">View and manage staff members</p>
          </div>
        )}
        {activeTab === "alerts" && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Alerts</h3>
            <p className="text-gray-600">View important notifications and alerts</p>
          </div>
        )}
      </main>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdate={handleUpdateIssue}
        />
      )}
    </div>
  );
}
