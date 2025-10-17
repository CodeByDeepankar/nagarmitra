"use client";

import { TrendingUp, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface DashboardStatsProps {
  totalReports: number;
  pending: number;
  inProgress: number;
  resolved: number;
}

export default function DashboardStats({
  totalReports,
  pending,
  inProgress,
  resolved,
}: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Reports",
      value: totalReports,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200",
      description: "All issues reported",
    },
    {
      label: "Pending",
      value: pending,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200",
      description: "Awaiting review",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200",
      description: "Being worked on",
    },
    {
      label: "Resolved",
      value: resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200",
      description: "Successfully fixed",
    },
  ];

  // Calculate percentage
  const resolvedPercentage = totalReports > 0 ? Math.round((resolved / totalReports) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`border-2 ${stat.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-1">
                {stat.label}
              </h3>
              <p className="text-sm text-gray-600">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resolution Rate Card */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Resolution Rate
                </h3>
                <p className="text-sm text-gray-600">
                  {resolved} out of {totalReports} issues resolved
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-emerald-600 mb-1">
                {resolvedPercentage}%
              </div>
              <p className="text-sm text-gray-600">success rate</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-1000 ease-out"
                style={{ width: `${resolvedPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      {totalReports > 0 && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> You can click on any issue card below to view detailed information, track progress, and see financial transparency for resolved issues.
          </p>
        </div>
      )}
    </div>
  );
}
