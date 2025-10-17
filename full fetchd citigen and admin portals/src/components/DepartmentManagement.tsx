import { useState } from 'react';
import { Department, Staff } from '../types/authority';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Plus, Edit, Trash2, Users, CheckCircle2, Clock } from 'lucide-react';
import { mockDepartments, mockStaff, getStaffByDepartment } from '../data/authorityMockData';
import { toast } from 'sonner@2.0.3';

export function DepartmentManagement() {
  const [departments, setDepartments] = useState(mockDepartments);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Department>>({});

  const handleEdit = (dept: Department) => {
    setSelectedDept(dept);
    setFormData(dept);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedDept(null);
    setFormData({
      name: '',
      description: '',
      headOfDepartment: '',
      staffCount: 0,
      activeIssues: 0,
      resolvedIssues: 0,
      averageResolutionTime: 0,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedDept) {
      // Update existing
      setDepartments(departments.map(d => 
        d.id === selectedDept.id ? { ...selectedDept, ...formData } : d
      ));
      toast.success('Department updated successfully');
    } else {
      // Add new
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        ...formData as Department,
      };
      setDepartments([...departments, newDept]);
      toast.success('Department created successfully');
    }
    
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
      toast.success('Department deleted successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Department Management</h2>
          <p className="text-slate-600">Manage departments and their performance metrics</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => {
          const deptStaff = getStaffByDepartment(dept.id);
          return (
            <Card key={dept.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-slate-900 mb-1">{dept.name}</h3>
                  <p className="text-sm text-slate-600">{dept.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(dept)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(dept.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Head of Department</span>
                  <span className="text-slate-900">{dept.headOfDepartment}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Staff
                  </span>
                  <Badge variant="outline">{dept.staffCount} members</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                    <p className="text-yellow-900">{dept.activeIssues}</p>
                    <p className="text-xs text-yellow-700">Active</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-green-900">{dept.resolvedIssues}</p>
                    <p className="text-xs text-green-700">Resolved</p>
                  </div>
                </div>

                <div className="text-center p-2 bg-blue-50 rounded">
                  <p className="text-sm text-blue-900">Avg. Resolution: <strong>{dept.averageResolutionTime} days</strong></p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit/Add Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedDept ? 'Edit Department' : 'Add New Department'}</DialogTitle>
            <DialogDescription>
              {selectedDept ? 'Update department information' : 'Create a new department'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Road & Infrastructure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of department responsibilities"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="head">Head of Department</Label>
              <Input
                id="head"
                value={formData.headOfDepartment || ''}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                placeholder="Name of department head"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staffCount">Staff Count</Label>
                <Input
                  id="staffCount"
                  type="number"
                  value={formData.staffCount || 0}
                  onChange={(e) => setFormData({ ...formData, staffCount: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="avgTime">Avg. Resolution Time (days)</Label>
                <Input
                  id="avgTime"
                  type="number"
                  value={formData.averageResolutionTime || 0}
                  onChange={(e) => setFormData({ ...formData, averageResolutionTime: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {selectedDept ? 'Update' : 'Create'} Department
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
