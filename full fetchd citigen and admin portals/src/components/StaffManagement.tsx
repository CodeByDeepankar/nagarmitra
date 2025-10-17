import { useState } from 'react';
import { Staff } from '../types/authority';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Plus, Edit, Trash2, Mail, Phone, CheckCircle2, Clock } from 'lucide-react';
import { mockStaff, mockDepartments } from '../data/authorityMockData';
import { toast } from 'sonner@2.0.3';

export function StaffManagement() {
  const [staff, setStaff] = useState(mockStaff);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Staff>>({});

  const handleEdit = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setFormData(staffMember);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      role: '',
      departmentId: '',
      phone: '',
      assignedIssues: 0,
      resolvedIssues: 0,
      isActive: true,
    });
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.departmentId) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (selectedStaff) {
      setStaff(staff.map(s => 
        s.id === selectedStaff.id ? { ...selectedStaff, ...formData } : s
      ));
      toast.success('Staff member updated successfully');
    } else {
      const newStaff: Staff = {
        id: `staff-${Date.now()}`,
        ...formData as Staff,
      };
      setStaff([...staff, newStaff]);
      toast.success('Staff member added successfully');
    }
    
    setIsEditModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this staff member?')) {
      setStaff(staff.filter(s => s.id !== id));
      toast.success('Staff member removed successfully');
    }
  };

  const toggleActive = (id: string) => {
    setStaff(staff.map(s => 
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ));
    toast.success('Staff status updated');
  };

  const getDepartmentName = (deptId: string) => {
    return mockDepartments.find(d => d.id === deptId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Staff Management</h2>
          <p className="text-slate-600">Manage staff members and their assignments</p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-center">Assigned</TableHead>
              <TableHead className="text-center">Resolved</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id} className={!member.isActive ? 'opacity-50' : ''}>
                <TableCell>
                  <div>
                    <p className="text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50">
                    {getDepartmentName(member.departmentId)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Mail className="w-3 h-3" />
                      <span className="text-xs">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">{member.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {member.assignedIssues}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {member.resolvedIssues}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={member.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  >
                    {member.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(member)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(member.id)}>
                      {member.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(member.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Edit/Add Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
            <DialogDescription>
              {selectedStaff ? 'Update staff member information' : 'Add a new staff member to the team'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staffName">Full Name *</Label>
                <Input
                  id="staffName"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staffRole">Role *</Label>
                <Input
                  id="staffRole"
                  value={formData.role || ''}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Field Engineer"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staffDept">Department *</Label>
              <Select
                value={formData.departmentId || ''}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="staffEmail">Email *</Label>
                <Input
                  id="staffEmail"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@municipal.gov"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="staffPhone">Phone</Label>
                <Input
                  id="staffPhone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive !== false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-slate-300"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active (can be assigned to issues)
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              {selectedStaff ? 'Update' : 'Add'} Staff Member
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
