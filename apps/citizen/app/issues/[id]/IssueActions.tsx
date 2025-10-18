"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { MoreVertical, Pencil, Trash2, Settings } from "lucide-react";
import { supabase } from "@repo/lib/supabaseClient";
import type { Issue } from "@repo/lib/types";
import toast from "react-hot-toast";

interface IssueActionsProps {
  issue: Issue;
}

const categories = [
  { value: "pothole", label: "🕳️ Pothole", emoji: "🕳️" },
  { value: "streetlight", label: "💡 Streetlight", emoji: "💡" },
  { value: "garbage", label: "🗑️ Garbage Collection", emoji: "🗑️" },
  { value: "drainage", label: "🚰 Drainage", emoji: "🚰" },
  { value: "road", label: "🛣️ Road Damage", emoji: "🛣️" },
  { value: "water", label: "💧 Water Supply", emoji: "💧" },
  { value: "other", label: "📋 Other", emoji: "📋" },
];

export default function IssueActions({ issue }: IssueActionsProps) {
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: issue.title,
    description: issue.description,
    category: issue.category,
  });

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
      router.refresh();
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
      // Delete the issue
      const { error } = await supabase
        .from("issues")
        .delete()
        .eq("id", issue.id);

      if (error) throw error;

      toast.success("Issue withdrawn successfully");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error withdrawing issue:", error);
      const message =
        error instanceof Error ? error.message : "Failed to withdraw issue";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Only show actions for pending issues
  const canEdit = issue.status === "Pending";
  const canWithdraw = true; // Can always withdraw

  return (
    <>
      {/* Floating Action Button with Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Issue Actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {canEdit && (
            <DropdownMenuItem
              onClick={() => setShowEditDialog(true)}
              className="cursor-pointer"
            >
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit Issue</span>
            </DropdownMenuItem>
          )}
          
          {!canEdit && (
            <DropdownMenuItem disabled className="text-gray-400">
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit (Only for Pending)</span>
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator />
          
          {canWithdraw && (
            <DropdownMenuItem
              onClick={() => setShowWithdrawDialog(true)}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Withdraw Issue</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Issue</DialogTitle>
            <DialogDescription>
              Update the details of your reported issue. You can only edit pending issues.
            </DialogDescription>
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
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
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
                If you need to update these, please withdraw this report and create a new one.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowEditDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Confirmation Dialog */}
      <AlertDialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw Issue Report?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to withdraw this issue report? This action cannot be undone.
              All associated data including comments will be permanently deleted.
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
