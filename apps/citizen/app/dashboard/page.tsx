"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import ProtectedRoute from "../components/ProtectedRoute";

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

function DashboardPageContent() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Issues</h1>
            <p className="text-gray-600">
              Track and manage your reported civic issues
            </p>
          </div>
          <Link href="/report">
            <Button variant="primary" size="lg">
              + Report New Issue
            </Button>
          </Link>
        </div>

        {loading ? (
          <Card>
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading issues...</p>
            </div>
          </Card>
        ) : issues.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Issues Reported Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Start by reporting your first civic issue
              </p>
              <Link href="/report">
                <Button variant="primary" size="lg">
                  Report an Issue
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {issues.map((issue: Issue) => (
              <Card key={issue.id}>
                <Link href={`/issues/${issue.id}`}>
                  <div className="flex gap-6 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                    {issue.image_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={issue.image_url}
                          alt={issue.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {issue.title}
                        </h3>
                        <Badge variant={getBadgeVariant(issue.status)}>
                          {issue.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {issue.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                          {issue.category}
                        </span>
                        <span>
                          {new Date(issue.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        {issue.latitude && issue.longitude && (
                          <span>📍 Location Added</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
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
