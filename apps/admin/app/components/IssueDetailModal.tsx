"use client";

import { useState } from "react";
import type { Issue } from "@repo/lib/types";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Badge } from "@repo/ui/badge";
import {
  X,
  MapPin,
  Calendar,
  User,
  Users,
  AlertCircle,
  Upload,
  IndianRupee,
} from "lucide-react";

interface IssueDetailModalProps {
  issue: Issue;
  onClose: () => void;
  onUpdate: (issueId: string, updates: Partial<Issue>) => Promise<void>;
}

export function IssueDetailModal({ issue, onClose, onUpdate }: IssueDetailModalProps) {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Update form state
  const [status, setStatus] = useState(issue.status);
  const [sanctionedAmount, setSanctionedAmount] = useState(issue.sanctioned_amount || 0);
  const [amountUsed, setAmountUsed] = useState(0);
  const [usageBreakdown, setUsageBreakdown] = useState("");
  const [startDate, setStartDate] = useState("");
  const [estimatedCompletion, setEstimatedCompletion] = useState(issue.estimated_completion_date || "");
  const [progressNotes, setProgressNotes] = useState(issue.progress_notes || "");
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSaveChanges = async () => {
    setUpdating(true);
    try {
      // TODO: Upload work photos to Supabase storage
      const updates = {
        status,
        sanctioned_amount: sanctionedAmount,
        estimated_completion_date: estimatedCompletion,
        progress_notes: progressNotes,
      };

      await onUpdate(issue.id, updates);
      setShowUpdateForm(false);
    } catch (error) {
      console.error("Error updating issue:", error);
      alert("Failed to update issue. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (showUpdateForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Update Report Progress</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage the lifecycle and progress of "{issue.title}"
              </p>
            </div>
            <button
              onClick={() => setShowUpdateForm(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Update Form */}
          <div className="p-6 space-y-6">
            {/* Current Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Status:
              </label>
              <Badge className={`${getStatusColor(issue.status)} uppercase text-xs px-3 py-1`}>
                {issue.status}
              </Badge>
            </div>

            {/* Update Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Update Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Pending">🔴 Pending / Not Started</option>
                <option value="In Progress">🔵 In Progress</option>
                <option value="Resolved">🟢 Resolved / Completed</option>
                <option value="Rejected">❌ Rejected</option>
              </select>
            </div>

            {/* Financial Details */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IndianRupee className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Financial Details</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sanctioned Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={sanctionedAmount}
                    onChange={(e) => setSanctionedAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Used (₹)
                  </label>
                  <input
                    type="number"
                    value={amountUsed}
                    onChange={(e) => setAmountUsed(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usage Breakdown
                </label>
                <input
                  type="text"
                  value={usageBreakdown}
                  onChange={(e) => setUsageBreakdown(e.target.value)}
                  placeholder="Materials: ₹3000, Labor: ₹1500, Equipment: ₹300..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Timeline</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Completion <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={estimatedCompletion}
                    onChange={(e) => setEstimatedCompletion(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Progress Description */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Progress Description / Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                value={progressNotes}
                onChange={(e) => setProgressNotes(e.target.value)}
                placeholder="Describe the current progress, work completed, or resolution summary..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Work Progress Photos */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Work Progress Photos</h3>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => setWorkPhotos(Array.from(e.target.files || []))}
                  className="hidden"
                  id="work-photos"
                />
                <label htmlFor="work-photos" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium mb-1">
                    Click to upload photos or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to 10MB (multiple allowed)
                  </p>
                </label>
                {workPhotos.length > 0 && (
                  <p className="text-sm text-blue-600 mt-2">
                    {workPhotos.length} file(s) selected
                  </p>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes/Remarks
              </label>
              <textarea
                placeholder="Internal notes for reference..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => setShowUpdateForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveChanges}
                disabled={updating}
                className="flex-1"
              >
                {updating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Detailed information about this civic issue report
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Category */}
          <div className="flex gap-3">
            <Badge className={`${getStatusColor(issue.status)} lowercase`}>
              {issue.status.toLowerCase()}
            </Badge>
            <Badge className="bg-gray-200 text-gray-800 lowercase">
              {issue.category}
            </Badge>
          </div>

          {/* Reported Issue */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reported Issue</h3>
            {issue.image_url && (
              <img
                src={issue.image_url}
                alt={issue.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{issue.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="text-gray-900 font-medium">
                    {issue.location?.toString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(issue.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(issue.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                  <p className="text-gray-900 font-medium">3 people</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-600 mb-1">Submitted By</p>
                  <p className="text-gray-900 font-medium">
                    {issue.user_id || "John Doe"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Alert */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-1">Pending Review</p>
                <p className="text-sm text-red-700">
                  This report is currently under review by the municipal authorities.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={() => setShowUpdateForm(true)}
              className="w-full"
            >
              Update Report Progress
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
