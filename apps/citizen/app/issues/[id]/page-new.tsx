"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import CommentsSection from "./CommentsSection";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Share2,
  Flag
} from "lucide-react";
import toast from "react-hot-toast";

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Resolved':
      return <CheckCircle className="w-5 h-5" />;
    case 'In Progress':
      return <Clock className="w-5 h-5" />;
    default:
      return <AlertCircle className="w-5 h-5" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'In Progress':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    default:
      return 'text-red-600 bg-red-50 border-red-200';
  }
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    pothole: '🕳️',
    streetlight: '💡',
    garbage: '🗑️',
    water: '💧',
    drainage: '🚰',
    other: '📋',
  };
  return icons[category] || icons.other;
};

export default function IssueDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        router.push("/auth/signin");
        return;
      }

      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        notFound();
      } else {
        setIssue(data as Issue);
      }
      setLoading(false);
    }
    loadData();
  }, [params.id, router]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading issue details...</p>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="hover:bg-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="shadow-xl border-0">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{getCategoryIcon(issue.category)}</span>
                      <Badge variant="outline" className="text-sm">
                        {issue.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {issue.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={handleShare}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Reported on {new Date(issue.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </CardHeader>

              {/* Image */}
              {issue.image_url && (
                <div className="relative h-96 bg-gray-100">
                  <img
                    src={issue.image_url}
                    alt={issue.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Description */}
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {issue.description}
                </p>
              </CardContent>
            </Card>

            {/* Location Card */}
            {(issue.location || (issue.latitude && issue.longitude)) && (
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {issue.location && typeof issue.location === 'object' && !Array.isArray(issue.location) && 'address' in issue.location && (
                    <div className="mb-4">
                      <p className="text-gray-700 font-medium mb-2">
                        📍 {String(issue.location.address)}
                      </p>
                    </div>
                  )}
                  {issue.latitude && issue.longitude && (
                    <>
                      <p className="text-gray-600 text-sm mb-3">
                        Coordinates: {issue.latitude}, {issue.longitude}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        View on Google Maps
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      {/* Map Placeholder */}
                      <div className="mt-4 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">
                          Map Preview (Integration pending)
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Comments Section */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-6">
                <CommentsSection issueId={params.id} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Status & Info */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card className={`shadow-xl border-2 ${getStatusColor(issue.status)}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(issue.status)}
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge 
                  className={`text-lg px-4 py-2 w-full justify-center ${
                    issue.status === 'Resolved' ? 'bg-green-100 text-green-800 border-green-200' :
                    issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  {issue.status}
                </Badge>
                <Separator className="my-4" />
                <div className="space-y-2 text-sm">
                  {issue.status === 'Pending' && (
                    <p className="text-gray-700">
                      Your issue has been reported and is awaiting review by the authorities.
                    </p>
                  )}
                  {issue.status === 'In Progress' && (
                    <p className="text-gray-700">
                      Your issue is being actively addressed by the authorities.
                    </p>
                  )}
                  {issue.status === 'Resolved' && (
                    <p className="text-gray-700">
                      This issue has been resolved. Thank you for reporting!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Card */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-lg">Issue Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Flag className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-gray-900">Reported</p>
                      <p className="text-sm text-gray-600">
                        {new Date(issue.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {issue.status !== 'Pending' && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Clock className="w-4 h-4 text-yellow-600" />
                        </div>
                        {issue.status === 'Resolved' && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-gray-900">In Progress</p>
                        <p className="text-sm text-gray-600">Authorities notified</p>
                      </div>
                    </div>
                  )}

                  {issue.status === 'Resolved' && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Resolved</p>
                        <p className="text-sm text-gray-600">Issue completed</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Flag className="w-4 h-4" />
                  Need Help?
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  If you have updates or questions about this issue, add a comment below or contact support.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
