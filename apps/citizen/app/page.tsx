import Link from "next/link";
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { supabase } from "@repo/lib/supabaseClient";

export default async function Home() {
  const { data: { user } } = await supabase.auth.getUser();

  let issuesSummary = null;
  if (user) {
    const { data: issues } = await supabase
      .from('issues')
      .select('status')
      .eq('user_id', user.id);

    if (issues && issues.length > 0) {
      issuesSummary = {
        total: issues.length,
        pending: issues.filter((i: any) => i.status === 'Pending').length,
        inProgress: issues.filter((i: any) => i.status === 'In Progress').length,
        resolved: issues.filter((i: any) => i.status === 'Resolved').length,
      };
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Nagar Mitra
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your voice matters! Report civic issues in your neighborhood and track their resolution.
            Together, we can make our city better.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/report">
              <Button variant="primary" size="lg">
                Report an Issue
              </Button>
            </Link>
            {user && (
              <Link href="/dashboard">
                <Button variant="secondary" size="lg">
                  My Issues
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-lg font-semibold mb-2">Report with Photo</h3>
              <p className="text-gray-600">
                Capture the issue with photos and location for accurate reporting
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-lg font-semibold mb-2">Track Location</h3>
              <p className="text-gray-600">
                Pinpoint exact locations to help authorities address issues faster
              </p>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-3"></div>
              <h3 className="text-lg font-semibold mb-2">Monitor Progress</h3>
              <p className="text-gray-600">
                Track the status of your reports from pending to resolved
              </p>
            </div>
          </Card>
        </div>

        {user && issuesSummary && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Issues Summary</h2>
            <Card>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{issuesSummary.total}</div>
                  <div className="text-sm text-gray-600">Total Issues</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-yellow-600">{issuesSummary.pending}</div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">{issuesSummary.inProgress}</div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600">{issuesSummary.resolved}</div>
                  <div className="text-sm text-gray-600">Resolved</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link href="/dashboard">
                  <Button variant="primary">
                    View All Issues
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}

        {!user && (
          <div className="max-w-2xl mx-auto text-center bg-blue-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Join Our Community
            </h2>
            <p className="text-gray-600 mb-4">
              Sign in to start reporting issues and track their progress
            </p>
            <Link href="/auth/signin">
              <Button variant="primary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
