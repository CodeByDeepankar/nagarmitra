import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export function TeacherOnboardingForm() {
  const [formData, setFormData] = useState({
    name: '',
    teacherId: '',
    role: '',
    subject: '',
    classAssigned: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = [
    'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 
    'English', 'History', 'Geography', 'Computer Science', 'Art'
  ];

  const classes = [
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.teacherId.trim()) {
      newErrors.teacherId = 'Teacher ID is required';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    if (formData.role === 'subject' && !formData.subject) {
      newErrors.subject = 'Please select your subject';
    }

    if (formData.role === 'class' && !formData.classAssigned) {
      newErrors.classAssigned = 'Please select your assigned class';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Here you would typically send the data to your backend
      alert('Profile setup completed successfully!');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-gray-800 mb-2">Tell us about you</CardTitle>
          <p className="text-muted-foreground">Please provide your details to complete your teacher profile</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`transition-all duration-200 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'}`}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Teacher ID Field */}
            <div className="space-y-2">
              <Label htmlFor="teacherId">Teacher ID</Label>
              <Input
                id="teacherId"
                placeholder="Enter your teacher ID"
                value={formData.teacherId}
                onChange={(e) => handleInputChange('teacherId', e.target.value)}
                className={`transition-all duration-200 ${errors.teacherId ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-blue-500'}`}
              />
              {errors.teacherId && <p className="text-sm text-red-500">{errors.teacherId}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Your Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
                className="grid grid-cols-2 gap-4"
              >
                <div className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${formData.role === 'class' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <RadioGroupItem value="class" id="class" />
                  <Label htmlFor="class" className="cursor-pointer flex-1">
                    <div>
                      <div className="font-medium">Class Teacher</div>
                      <div className="text-sm text-muted-foreground">Responsible for a specific class</div>
                    </div>
                  </Label>
                </div>
                
                <div className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${formData.role === 'subject' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <RadioGroupItem value="subject" id="subject" />
                  <Label htmlFor="subject" className="cursor-pointer flex-1">
                    <div>
                      <div className="font-medium">Subject Teacher</div>
                      <div className="text-sm text-muted-foreground">Teaches specific subjects</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            {/* Conditional Fields */}
            {formData.role === 'subject' && (
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => handleInputChange('subject', value)}>
                  <SelectTrigger className={`transition-all duration-200 ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}>
                    <SelectValue placeholder="Select your subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && <p className="text-sm text-red-500">{errors.subject}</p>}
              </div>
            )}

            {formData.role === 'class' && (
              <div className="space-y-2">
                <Label>Assigned Class</Label>
                <Select value={formData.classAssigned} onValueChange={(value) => handleInputChange('classAssigned', value)}>
                  <SelectTrigger className={`transition-all duration-200 ${errors.classAssigned ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}>
                    <SelectValue placeholder="Select your assigned class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.classAssigned && <p className="text-sm text-red-500">{errors.classAssigned}</p>}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <Button 
                type="button"
                variant="outline" 
                className="flex items-center gap-2 hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                Back
              </Button>
              
              <Button 
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
              >
                <CheckCircle size={16} />
                Complete Setup
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}