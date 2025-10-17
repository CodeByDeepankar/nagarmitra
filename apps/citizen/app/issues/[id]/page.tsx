import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@repo/ui/badge";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import CommentsSection from "./CommentsSection";
import IssueActions from "./IssueActions";

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
  params: Promise<{ id: string }> 
}) {
  // Await params (Next.js 15 requirement)
  const { id } = await params;
  
  // Get user without redirecting
  const { data: { user } } = await supabase.auth.getUser();

  const { data: issue, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !issue) {
    notFound();
  }

  const typedIssue = issue as Issue;
  
  // Check if the current user is the owner
  const isOwner = user?.id === typedIssue.user_id;

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

        <div className="relative">
          <Card>
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
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
          {(typedIssue.location || (typedIssue.latitude && typedIssue.longitude)) && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Location</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                {typedIssue.location && typeof typedIssue.location === 'object' && !Array.isArray(typedIssue.location) && 'address' in typedIssue.location && (
                  <p className="text-gray-700 mb-2">
                    📍 {String(typedIssue.location.address)}
                  </p>
                )}
                {typedIssue.latitude && typedIssue.longitude && (
                  <>
                    <p className="text-gray-600 text-sm mb-2">
                      Coordinates: {typedIssue.latitude}, {typedIssue.longitude}
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* Status Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-1">Issue Status</h3>
            <p className="text-blue-800 text-sm">
              {typedIssue.status === 'Pending' && 
                "This issue has been reported and is awaiting review by the authorities."}
              {typedIssue.status === 'In Progress' && 
                "This issue is being actively addressed by the authorities."}
              {typedIssue.status === 'Resolved' && 
                "This issue has been resolved. Thank you for your interest!"}
            </p>
          </div>

          {/* Owner Info Banner */}
          {isOwner && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-green-900 mb-1 flex items-center gap-2">
                👤 You are the reporter of this issue
              </h3>
              <p className="text-green-800 text-sm">
                You can edit the details while it&apos;s pending, or withdraw the report at any time using the buttons above.
              </p>
            </div>
          )}

            {/* Comments Section */}
            {user && <CommentsSection issueId={id} />}
            
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800 mb-2">
                  Sign in to add comments and interact with this issue
                </p>
                <Link href="/auth/signin">
                  <Button size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </Card>

          {/* Floating Action Menu - Only for Owner */}
          {isOwner && (
            <div className="fixed bottom-8 right-8 z-50">
              <IssueActions issue={typedIssue} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
