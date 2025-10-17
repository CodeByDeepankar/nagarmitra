import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import CommentsSection from "./CommentsSection";

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

export default async function IssueDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  const { data: issue, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !issue) {
    notFound();
  }

  const typedIssue = issue as Issue;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card>
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {typedIssue.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="capitalize bg-gray-100 px-3 py-1 rounded-full">
                  {typedIssue.category}
                </span>
                <span>
                  Reported on {new Date(typedIssue.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
            <Badge variant={getBadgeVariant(typedIssue.status)} className="text-base px-4 py-2">
              {typedIssue.status}
            </Badge>
          </div>

          {/* Image */}
          {typedIssue.image_url && (
            <div className="mb-6">
              <img
                src={typedIssue.image_url}
                alt={typedIssue.title}
                className="w-full max-h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {typedIssue.description}
            </p>
          </div>

          {/* Location */}
          {typedIssue.latitude && typedIssue.longitude && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Location</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">
                  📍 Coordinates: {typedIssue.latitude}, {typedIssue.longitude}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${typedIssue.latitude},${typedIssue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Google Maps →
                </a>
                {/* Placeholder for map - Mapbox integration would go here */}
                <div className="mt-4 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Map Preview (Mapbox integration placeholder)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-1">Issue Status</h3>
            <p className="text-blue-800 text-sm">
              {typedIssue.status === 'Pending' && 
                "Your issue has been reported and is awaiting review by the authorities."}
              {typedIssue.status === 'In Progress' && 
                "Your issue is being actively addressed by the authorities."}
              {typedIssue.status === 'Resolved' && 
                "This issue has been resolved. Thank you for reporting!"}
            </p>
          </div>

          {/* Comments Section */}
          <CommentsSection issueId={params.id} />
        </Card>
      </div>
    </div>
  );
}
