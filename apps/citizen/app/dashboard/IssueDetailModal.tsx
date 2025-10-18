"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MapPin, Calendar, Pencil, Trash2, ExternalLink, DollarSign, TrendingDown, Banknote } from "lucide-react";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import toast from "react-hot-toast";
import ProgressTimeline from "../components/ProgressTimeline";

interface IssueDetailModalProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIssueUpdated?: () => void;
}

const categories = [
  { value: "pothole", label: "🕳️ Pothole" },
  { value: "streetlight", label: "💡 Streetlight" },
  { value: "garbage", label: "🗑️ Garbage Collection" },
  { value: "drainage", label: "🚰 Drainage" },
  { value: "road", label: "🛣️ Road Damage" },
  { value: "water", label: "💧 Water Supply" },
  { value: "other", label: "📋 Other" },
];

const getBadgeClassName = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function IssueDetailModal({
  issue,
  open,
  onOpenChange,
  onIssueUpdated,
}: IssueDetailModalProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: issue?.title || "",
    description: issue?.description || "",
    category: issue?.category || "",
  });

  // Update form data when issue changes
  useState(() => {
    if (issue) {
      setFormData({
        title: issue.title,
        description: issue.description,
        category: issue.category,
      });
    }
  });

  if (!issue) return null;

  const canEdit = issue.status === "Pending";

  const handleEdit = async () => {
    if (!formData.title.trim() || formData.title.length < 10) {
      toast.error("Title must be at least 10 characters");
      return;
    }
    if (!formData.description.trim() || formData.description.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("issues")
        .update({
          title: formData.title,
          description: formData.description,
          category: formData.category,
        })
        .eq("id", issue.id);

      if (error) throw error;

      toast.success("Issue updated successfully! 🎉");
      setShowEditDialog(false);
      onOpenChange(false);
      onIssueUpdated?.();
    } catch (error: unknown) {
      console.error("Error updating issue:", error);
      const message =
        error instanceof Error ? error.message : "Failed to update issue";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("issues")
        .delete()
        .eq("id", issue.id);

      if (error) throw error;

      toast.success("Issue withdrawn successfully");
      setShowWithdrawDialog(false);
      onOpenChange(false);
      onIssueUpdated?.();
    } catch (error: unknown) {
      console.error("Error withdrawing issue:", error);
      const message =
        error instanceof Error ? error.message : "Failed to withdraw issue";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open && !showEditDialog && !showWithdrawDialog} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-start justify-between gap-4">
              <span className="flex-1">{issue.title}</span>
              <Badge variant="outline" className={`text-sm ${getBadgeClassName(issue.status)}`}>
                {issue.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Category and Date */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className="capitalize bg-gray-100 px-3 py-1.5 rounded-full border">
                {issue.category}
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(issue.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Image */}
            {issue.image_url && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={issue.image_url}
                  alt={issue.title}
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {issue.description}
              </p>
            </div>

            {/* Progress Timeline */}
            <ProgressTimeline
              currentStatus={issue.status}
              createdAt={issue.created_at}
              estimatedStartDate={issue.estimated_start_date}
              estimatedCompletionDate={issue.estimated_completion_date}
              actualCompletionDate={issue.actual_completion_date}
            />

            {/* Location */}
            {(issue.location || (issue.latitude && issue.longitude)) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
                  {issue.location && typeof issue.location === 'object' && !Array.isArray(issue.location) && 'address' in issue.location && (
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 flex-1">
                        {String(issue.location.address)}
                      </p>
                    </div>
                  )}
                  {issue.latitude && issue.longitude && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Coordinates: {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Maps
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Status Info */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">Status Information</h3>
              <p className="text-blue-800 text-sm">
                {issue.status === 'Pending' && 
                  "Your issue has been reported and is awaiting review by the authorities."}
                {issue.status === 'In Progress' && 
                  "Your issue is being actively addressed by the authorities."}
                {issue.status === 'Resolved' && 
                  "This issue has been resolved. Thank you for reporting!"}
              </p>
            </div>

            {/* Financial Transparency - Only show for resolved or in-progress issues */}
            {(issue.status === 'Resolved' || issue.status === 'In Progress') && 
             (issue.sanctioned_amount || issue.used_amount) && (
              <div className="bg-green-50 border border-green-200 p-5 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Transparency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sanctioned Amount */}
                  {issue.sanctioned_amount && (
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Budget Approved</span>
                        <Banknote className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{Number(issue.sanctioned_amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}

                  {/* Used Amount */}
                  {issue.used_amount !== null && issue.used_amount !== undefined && (
                    <div className="bg-white p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Amount Spent</span>
                        <DollarSign className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        ₹{Number(issue.used_amount).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}

                  {/* Savings */}
                  {issue.sanctioned_amount && issue.used_amount !== null && issue.used_amount !== undefined && (
                    <div className="bg-white p-4 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          {Number(issue.sanctioned_amount) - Number(issue.used_amount) >= 0 ? 'Savings' : 'Excess'}
                        </span>
                        <TrendingDown className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className={`text-2xl font-bold ${
                        Number(issue.sanctioned_amount) - Number(issue.used_amount) >= 0 
                          ? 'text-emerald-700' 
                          : 'text-red-700'
                      }`}>
                        ₹{Math.abs(Number(issue.sanctioned_amount) - Number(issue.used_amount)).toLocaleString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Expense Breakdown */}
                {issue.amount_breakdown && typeof issue.amount_breakdown === 'object' && (
                  <div className="mt-4 bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900 mb-3 text-sm">Expense Breakdown</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(issue.amount_breakdown).map(([key, value]) => (
                        <div key={key} className="text-center p-2 bg-gray-50 rounded">
                          <p className="text-xs text-gray-600 capitalize mb-1">{key}</p>
                          <p className="text-sm font-semibold text-gray-900">
                            ₹{Number(value).toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {issue.status === 'Resolved' && (
                  <p className="text-xs text-green-700 mt-3 italic">
                    💡 This financial information is now public to ensure transparency in civic spending.
                  </p>
                )}
              </div>
            )}

            {/* Priority and Complaint Count */}
            {(issue.priority || (issue.complaint_count && issue.complaint_count > 1)) && (
              <div className="flex flex-wrap gap-3">
                {issue.priority && (
                  <div className={`px-4 py-2 rounded-lg border ${
                    issue.priority === 'high' ? 'bg-red-50 border-red-200 text-red-800' :
                    issue.priority === 'medium' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                    'bg-gray-50 border-gray-200 text-gray-800'
                  }`}>
                    <span className="text-sm font-medium">
                      Priority: {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                    </span>
                  </div>
                )}
                {issue.complaint_count && issue.complaint_count > 1 && (
                  <div className="px-4 py-2 rounded-lg border bg-orange-50 border-orange-200">
                    <span className="text-sm font-medium text-orange-800">
                      {issue.complaint_count} citizens reported this issue
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1"
              >
                Close
              </Button>
              {canEdit && (
                <Button
                  onClick={() => {
                    setFormData({
                      title: issue.title,
                      description: issue.description,
                      category: issue.category,
                    });
                    setShowEditDialog(true);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
              )}
              <Button
                onClick={() => setShowWithdrawDialog(true)}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Withdraw
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief title of the issue"
                maxLength={100}
              />
              <p className="text-sm text-gray-500">
                {formData.title.length}/100 characters (min 10)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Detailed description of the issue"
                rows={6}
                maxLength={1000}
              />
              <p className="text-sm text-gray-500">
                {formData.description.length}/1000 characters (min 20)
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> You cannot change the location or image after reporting.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={loading} className="flex-1">
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Issue Report?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this issue report? This action cannot be undone.
              All associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleWithdraw}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {loading ? "Withdrawing..." : "Yes, Withdraw"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
