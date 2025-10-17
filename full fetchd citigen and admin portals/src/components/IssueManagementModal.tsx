import { useState } from 'react';
import { Report } from '../types/report';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { 
  MapPin, 
  Calendar, 
  User, 
  Upload,
  Save,
  Clock,
  DollarSign,
  MessageSquare,
  History,
  AlertCircle,
} from 'lucide-react';
import { format } from '../utils/date';
import { mockDepartments, mockStaff, getStaffByDepartment, getAuditLogsByReport, getCommentsByReport } from '../data/authorityMockData';
import { toast } from 'sonner@2.0.3';

interface IssueManagementModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (report: Report) => void;
}

export function IssueManagementModal({ report, open, onClose, onUpdate }: IssueManagementModalProps) {
  const [formData, setFormData] = useState<Partial<Report>>(report || {});
  const [newComment, setNewComment] = useState('');
  const [isPrivateComment, setIsPrivateComment] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(report?.assignedToDepartment || '');
  
  if (!report) return null;

  const auditLogs = getAuditLogsByReport(report.id);
  const comments = getCommentsByReport(report.id);
  const availableStaff = selectedDepartment ? getStaffByDepartment(selectedDepartment) : mockStaff;

  const handleSave = () => {
    const updatedReport: Report = {
      ...report,
      ...formData,
      lastUpdatedBy: 'Admin Officer',
      lastUpdatedAt: new Date(),
    };
    
    onUpdate?.(updatedReport);
    toast.success('Issue updated successfully');
    onClose();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    toast.success('Comment added successfully');
    setNewComment('');
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'resolved': 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'pending': 'bg-red-100 text-red-800 border-red-200',
      'not-started': 'bg-gray-100 text-gray-800 border-gray-200',
      'rejected': 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[priority] || colors.low;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{report.title}</DialogTitle>
          <DialogDescription>
            Issue ID: #{report.id} | Manage and update this civic issue report
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="assignment">Assignment</TabsTrigger>
            <TabsTrigger value="comments">Comments ({comments.length})</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-240px)] pr-4">
            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6 mt-4">
              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={formData.status || report.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as Report['status'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select 
                    value={formData.priority || report.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as Report['priority'] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Report Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-500">Reporter</Label>
                  <p className="text-slate-900">{report.submittedBy}</p>
                  {report.submittedByEmail && (
                    <p className="text-sm text-slate-600">{report.submittedByEmail}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-500">Submitted</Label>
                  <p className="text-slate-900">{format(new Date(report.submittedAt), 'PPpp')}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-500">Location</Label>
                  <p className="text-slate-900">{report.location.address}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-500">Complaint Count</Label>
                  <p className="text-slate-900">{report.complaintCount} people</p>
                </div>
              </div>

              <Separator />

              {/* Issue Image */}
              <div className="space-y-2">
                <Label>Issue Photo</Label>
                <img src={report.image} alt={report.title} className="w-full h-64 object-cover rounded-lg" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-slate-700 bg-slate-50 p-4 rounded-lg">{report.description}</p>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimatedStart">Estimated Start Date</Label>
                  <Input 
                    id="estimatedStart"
                    type="date"
                    value={formData.estimatedStartDate ? new Date(formData.estimatedStartDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, estimatedStartDate: new Date(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="predictedCompletion">Predicted Completion</Label>
                  <Input 
                    id="predictedCompletion"
                    type="date"
                    value={formData.predictedCompletion ? new Date(formData.predictedCompletion).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, predictedCompletion: new Date(e.target.value) })}
                  />
                </div>
              </div>

              {/* Progress Details */}
              <div className="space-y-2">
                <Label htmlFor="progressDetails">Progress Details</Label>
                <Textarea 
                  id="progressDetails"
                  placeholder="Add progress updates..."
                  value={formData.progressDetails || ''}
                  onChange={(e) => setFormData({ ...formData, progressDetails: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Financial Data */}
              {(formData.status === 'resolved' || formData.status === 'in-progress') && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="text-slate-900 flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Financial Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sanctionedAmount">Sanctioned Amount ($)</Label>
                        <Input 
                          id="sanctionedAmount"
                          type="number"
                          placeholder="0.00"
                          value={formData.financialData?.sanctionedAmount || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            financialData: { 
                              ...formData.financialData,
                              sanctionedAmount: parseFloat(e.target.value) || 0,
                              usedAmount: formData.financialData?.usedAmount || 0,
                              usageDetails: formData.financialData?.usageDetails || ''
                            }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="usedAmount">Amount Used ($)</Label>
                        <Input 
                          id="usedAmount"
                          type="number"
                          placeholder="0.00"
                          value={formData.financialData?.usedAmount || ''}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            financialData: { 
                              ...formData.financialData,
                              sanctionedAmount: formData.financialData?.sanctionedAmount || 0,
                              usedAmount: parseFloat(e.target.value) || 0,
                              usageDetails: formData.financialData?.usageDetails || ''
                            }
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="usageDetails">Usage Details</Label>
                      <Textarea 
                        id="usageDetails"
                        placeholder="Breakdown of expenses..."
                        value={formData.financialData?.usageDetails || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          financialData: { 
                            ...formData.financialData,
                            sanctionedAmount: formData.financialData?.sanctionedAmount || 0,
                            usedAmount: formData.financialData?.usedAmount || 0,
                            usageDetails: e.target.value
                          }
                        })}
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Rejection Reason */}
              {formData.status === 'rejected' && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="rejectionReason">Rejection Reason</Label>
                    <Textarea 
                      id="rejectionReason"
                      placeholder="Explain why this report is being rejected..."
                      value={formData.rejectionReason || ''}
                      onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Admin Notes */}
              <div className="space-y-2">
                <Label htmlFor="adminNotes">Internal Admin Notes</Label>
                <Textarea 
                  id="adminNotes"
                  placeholder="Private notes for internal use only..."
                  value={formData.adminNotes || ''}
                  onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Assignment Tab */}
            <TabsContent value="assignment" className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Assign to Department</Label>
                  <Select 
                    value={selectedDepartment}
                    onValueChange={(value) => {
                      setSelectedDepartment(value);
                      const dept = mockDepartments.find(d => d.id === value);
                      setFormData({ 
                        ...formData, 
                        assignedToDepartment: value,
                        assignedDepartmentName: dept?.name,
                        assignedTo: undefined,
                        assignedToName: undefined,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assign to Staff Member</Label>
                  <Select 
                    value={formData.assignedTo || ''}
                    onValueChange={(value) => {
                      const staff = availableStaff.find(s => s.id === value);
                      setFormData({ 
                        ...formData, 
                        assignedTo: value,
                        assignedToName: staff?.name,
                        assignedAt: new Date(),
                      });
                    }}
                    disabled={!selectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedDepartment ? "Select staff member" : "Select department first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStaff.map((staff) => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name} - {staff.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.assignedToName && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Assigned to:</strong> {formData.assignedToName} ({formData.assignedDepartmentName})
                    </p>
                    {formData.assignedAt && (
                      <p className="text-xs text-blue-700 mt-1">
                        Assigned on: {format(new Date(formData.assignedAt), 'PPpp')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Comments Tab */}
            <TabsContent value="comments" className="space-y-6 mt-4">
              {/* Existing Comments */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className={`p-4 rounded-lg border ${comment.isPrivate ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-slate-900">{comment.authorName}</p>
                        <p className="text-xs text-slate-500">{format(new Date(comment.timestamp), 'PPpp')}</p>
                      </div>
                      {comment.isPrivate && (
                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          Private
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-700">{comment.message}</p>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center text-slate-500 py-8">No comments yet</p>
                )}
              </div>

              <Separator />

              {/* Add New Comment */}
              <div className="space-y-3">
                <Label htmlFor="newComment">Add Comment</Label>
                <Textarea 
                  id="newComment"
                  placeholder="Type your comment here..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isPrivateComment}
                      onChange={(e) => setIsPrivateComment(e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    Make this comment private (internal only)
                  </label>
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4 mt-4">
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <History className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-slate-900">{log.action}</p>
                        <p className="text-xs text-slate-500">{format(new Date(log.timestamp), 'PPpp')}</p>
                      </div>
                      <p className="text-sm text-slate-600">{log.details}</p>
                      <p className="text-xs text-slate-500 mt-1">by {log.adminName}</p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-center text-slate-500 py-8">No history available</p>
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
