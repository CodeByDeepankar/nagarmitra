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
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Upload, Save, AlertCircle, IndianRupee, Calendar as CalendarIcon, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { format } from '../utils/date';

interface ProgressUpdateModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedReport: Report) => void;
}

export function ProgressUpdateModal({ report, open, onClose, onUpdate }: ProgressUpdateModalProps) {
  const [formData, setFormData] = useState<Partial<Report>>(report || {});
  const [progressPhotos, setProgressPhotos] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (!report) return null;

  const validateStatusChange = (newStatus: Report['status']): boolean => {
    const errors: string[] = [];

    // Pending → In Progress validation
    if (report.status === 'pending' && newStatus === 'in-progress') {
      if (!formData.financialData?.sanctionedAmount || formData.financialData.sanctionedAmount <= 0) {
        errors.push('Sanctioned money is required when starting work');
      }
      if (!formData.estimatedStartDate) {
        errors.push('Estimated start date is required');
      }
      if (!formData.predictedCompletion) {
        errors.push('Estimated completion date is required');
      }
      if (!formData.progressDetails || formData.progressDetails.trim() === '') {
        errors.push('Progress notes are required when starting work');
      }
    }

    // In Progress → Resolved validation
    if (report.status === 'in-progress' && newStatus === 'resolved') {
      if (!formData.completedAt) {
        errors.push('Completion date is required');
      }
      if (!formData.completionImage && progressPhotos.length === 0) {
        errors.push('At least one completion photo is required');
      }
      if (!formData.financialData?.usedAmount || formData.financialData.usedAmount <= 0) {
        errors.push('Total money used must be specified');
      }
      if (!formData.progressDetails || formData.progressDetails.trim() === '') {
        errors.push('Completion summary is required');
      }
    }

    // Any → Delayed validation
    if (newStatus === 'rejected') {
      if (!formData.rejectionReason || formData.rejectionReason.trim() === '') {
        errors.push('Rejection reason is mandatory');
      }
    }

    // Set delay reason for delayed status
    if (newStatus === 'in-progress' && formData.delayReason) {
      // Delay noted
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleStatusChange = (newStatus: string) => {
    setFormData({ ...formData, status: newStatus as Report['status'] });
    setValidationErrors([]);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          if (newPhotos.length === files.length) {
            setProgressPhotos([...progressPhotos, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSave = () => {
    // Validate status change
    if (formData.status && formData.status !== report.status) {
      if (!validateStatusChange(formData.status)) {
        toast.error('Please complete all required fields');
        return;
      }
    }

    // Build updated report
    const updatedReport: Report = {
      ...report,
      ...formData,
      lastUpdatedBy: 'Admin Officer',
      lastUpdatedAt: new Date(),
    };

    // Add progress photos if any
    if (progressPhotos.length > 0) {
      updatedReport.progressImages = [...(updatedReport.progressImages || []), ...progressPhotos];
      if (formData.status === 'resolved') {
        updatedReport.completionImage = progressPhotos[progressPhotos.length - 1];
      }
    }

    // Set completion date for resolved
    if (formData.status === 'resolved' && !updatedReport.completedAt) {
      updatedReport.completedAt = new Date();
    }

    // Set rejection date
    if (formData.status === 'rejected' && !updatedReport.rejectedAt) {
      updatedReport.rejectedAt = new Date();
    }

    // Save and notify
    onUpdate(updatedReport);
    toast.success('Report progress updated successfully');
    onClose();
    
    // Reset form
    setProgressPhotos([]);
    setValidationErrors([]);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-red-100 text-red-800 border-red-200',
      'in-progress': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'resolved': 'bg-green-100 text-green-800 border-green-200',
      'rejected': 'bg-slate-100 text-slate-800 border-slate-200',
    };
    return colors[status] || colors.pending;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Update Report Progress</DialogTitle>
          <DialogDescription>
            Manage the lifecycle and progress of "{report.title}"
          </DialogDescription>
        </DialogHeader>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Please fix the following errors:</strong>
              <ul className="mt-2 list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6 py-4">
          {/* Current Status Display */}
          <div className="flex items-center gap-3">
            <Label>Current Status:</Label>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report.status)}`}>
              {report.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>

          <Separator />

          {/* Status Change */}
          <div className="space-y-2">
            <Label htmlFor="status">Update Status *</Label>
            <Select 
              value={formData.status || report.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">🔴 Pending / Not Started</SelectItem>
                <SelectItem value="in-progress">🟡 In Progress</SelectItem>
                <SelectItem value="resolved">🟢 Resolved</SelectItem>
                <SelectItem value="rejected">⚫ Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h4 className="text-slate-900 flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Financial Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sanctionedAmount">Sanctioned Amount (₹) *</Label>
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
                <Label htmlFor="usedAmount">Amount Used (₹)</Label>
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
              <Label htmlFor="usageDetails">Usage Breakdown</Label>
              <Textarea 
                id="usageDetails"
                placeholder="Materials: ₹3000, Labor: ₹1500, Equipment: ₹300..."
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
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Timeline
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  id="startDate"
                  type="date"
                  value={formData.estimatedStartDate ? new Date(formData.estimatedStartDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, estimatedStartDate: new Date(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="completionDate">Estimated Completion *</Label>
                <Input 
                  id="completionDate"
                  type="date"
                  value={formData.predictedCompletion ? new Date(formData.predictedCompletion).toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, predictedCompletion: new Date(e.target.value) })}
                />
              </div>
            </div>
            {formData.status === 'resolved' && (
              <div className="space-y-2">
                <Label htmlFor="actualCompletion">Actual Completion Date *</Label>
                <Input 
                  id="actualCompletion"
                  type="date"
                  value={formData.completedAt ? new Date(formData.completedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, completedAt: new Date(e.target.value) })}
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Progress Description */}
          <div className="space-y-2">
            <Label htmlFor="progressDetails">
              Progress Description / Summary *
            </Label>
            <Textarea 
              id="progressDetails"
              placeholder="Describe the current progress, work completed, or resolution summary..."
              value={formData.progressDetails || ''}
              onChange={(e) => setFormData({ ...formData, progressDetails: e.target.value })}
              rows={4}
            />
          </div>

          {/* Delay Reason (if applicable) */}
          {(formData.delayReason !== undefined || formData.status === 'in-progress') && (
            <div className="space-y-2">
              <Label htmlFor="delayReason">Delay Reason (if applicable)</Label>
              <Textarea 
                id="delayReason"
                placeholder="Explain any delays in the project timeline..."
                value={formData.delayReason || ''}
                onChange={(e) => setFormData({ ...formData, delayReason: e.target.value })}
                rows={2}
              />
            </div>
          )}

          {/* Rejection Reason */}
          {formData.status === 'rejected' && (
            <div className="space-y-2">
              <Label htmlFor="rejectionReason">Rejection Reason *</Label>
              <Textarea 
                id="rejectionReason"
                placeholder="Explain why this report is being rejected..."
                value={formData.rejectionReason || ''}
                onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                rows={3}
              />
            </div>
          )}

          <Separator />

          {/* Photo Upload */}
          <div className="space-y-4">
            <h4 className="text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Work Progress Photos {formData.status === 'resolved' && '*'}
            </h4>
            <div className="space-y-3">
              <Label htmlFor="photoUpload" className="cursor-pointer">
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 hover:border-blue-500 transition-colors text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm text-slate-600">Click to upload photos or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB (multiple allowed)</p>
                </div>
                <Input 
                  id="photoUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </Label>

              {/* Photo Preview */}
              {progressPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {progressPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={photo} 
                        alt={`Progress ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => setProgressPhotos(progressPhotos.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="space-y-2">
            <Label htmlFor="adminNotes">Additional Notes/Remarks</Label>
            <Textarea 
              id="adminNotes"
              placeholder="Internal notes for reference..."
              value={formData.adminNotes || ''}
              onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
              rows={2}
            />
          </div>
        </div>

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
