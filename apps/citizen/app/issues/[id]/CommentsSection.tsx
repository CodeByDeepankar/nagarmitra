"use client";

import { useState, FormEvent } from "react";
import { Button } from "@repo/ui/button";
import { TextArea } from "@repo/ui/input";
import { supabase } from "@repo/lib/supabaseClient";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
}

export default function CommentsSection({ issueId }: { issueId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  // Load comments
  useState(() => {
    loadComments();
  });

  const loadComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('issue_id', issueId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setComments(data as Comment[]);
    }
    setLoadingComments(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please sign in to comment");
        return;
      }

      const { error } = await supabase
        .from('comments')
        .insert({
          issue_id: issueId,
          user_id: user.id,
          content: newComment,
        });

      if (error) throw error;

      setNewComment("");
      await loadComments();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Comments</h2>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <TextArea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <div className="mt-2">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !newComment.trim()}
          >
            {loading ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {loadingComments ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 mb-2">{comment.content}</p>
              <p className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
