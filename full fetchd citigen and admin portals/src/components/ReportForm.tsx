import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Card } from './ui/card';
import { Upload, MapPin, AlertCircle, CheckCircle2, Mic, MicOff } from 'lucide-react';
import { ReportCategory } from '../types/report';
import { findSimilarReport } from '../data/mockData';
import { toast } from 'sonner@2.0.3';

interface ReportFormProps {
  open: boolean;
  onClose: () => void;
}

export function ReportForm({ open, onClose }: ReportFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as ReportCategory | '',
    address: '',
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [similarReport, setSimilarReport] = useState<any>(null);
  const [showSimilarCheck, setShowSimilarCheck] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const categories: { value: ReportCategory; label: string }[] = [
    { value: 'potholes', label: 'Potholes' },
    { value: 'streetlight', label: 'Street Light' },
    { value: 'drainage', label: 'Drainage' },
    { value: 'garbage', label: 'Garbage Collection' },
    { value: 'water-supply', label: 'Water Supply' },
    { value: 'road-damage', label: 'Road Damage' },
    { value: 'park-maintenance', label: 'Park Maintenance' },
    { value: 'other', label: 'Other' },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In real app, reverse geocode these coordinates
          const mockAddress = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
          setFormData({ ...formData, address: mockAddress });
          setIsGettingLocation(false);
          toast.success('Location captured successfully');
        },
        (error) => {
          console.error('Error getting location:', error.message || 'Unknown error');
          toast.error('Failed to get location. Please enter manually.');
          setIsGettingLocation(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
    }
  };

  const checkForSimilarReports = () => {
    const similar = findSimilarReport(formData.title, formData.address);
    if (similar) {
      setSimilarReport(similar);
      setShowSimilarCheck(true);
    } else {
      submitNewReport();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      toast.error('Please upload an image of the issue');
      return;
    }

    checkForSimilarReports();
  };

  const submitNewReport = () => {
    // In real app, this would call an API
    console.log('Submitting new report:', formData);
    toast.success('Report submitted successfully!');
    resetForm();
    onClose();
  };

  const incrementExistingReport = () => {
    // In real app, this would increment the count in the database
    console.log('Incrementing count for report:', similarReport.id);
    toast.success('Your report has been added to the existing case!');
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      address: '',
      image: null,
    });
    setImagePreview('');
    setSimilarReport(null);
    setShowSimilarCheck(false);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Simulate speech-to-text conversion
        const simulatedText = 'This is a simulated voice input. There is a large pothole near the intersection that needs immediate attention.';
        setFormData({ ...formData, description: formData.description + ' ' + simulatedText });
        toast.success('Voice recorded! (Simulated transcription)');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording... Click again to stop');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  return (
    <>
      <Dialog open={open && !showSimilarCheck} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report a New Civic Issue</DialogTitle>
            <DialogDescription>
              Submit details about a civic problem in your area. Include photos and location for faster resolution.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label htmlFor="image">Upload Image *</Label>
              <div className="mt-2">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setFormData({ ...formData, image: null });
                        setImagePreview('');
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-slate-50"
                  >
                    <Upload className="w-12 h-12 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600">Click to upload image</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 10MB</p>
                  </label>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the issue"
                required
                className="mt-2"
              />
            </div>

            {/* Description with Voice Input */}
            <div>
              <Label htmlFor="description">Detailed Description *</Label>
              <div className="relative mt-2">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide detailed information about the issue... (or use voice input)"
                  required
                  rows={4}
                  className="pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceRecording}
                  className={`absolute right-2 top-2 ${isRecording ? 'text-red-600' : 'text-slate-600'}`}
                  title={isRecording ? 'Stop recording' : 'Start voice input'}
                >
                  {isRecording ? (
                    <MicOff className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Click the microphone icon to use voice input (simulated speech-to-text)
              </p>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as ReportCategory })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select issue category" />
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

            {/* Location */}
            <div>
              <Label htmlFor="address">Location *</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter address or get current location"
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {isGettingLocation ? 'Getting...' : 'Use Current'}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Submit Report
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Similar Report Check Dialog */}
      <Dialog open={showSimilarCheck} onOpenChange={setShowSimilarCheck}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Similar Report Found</DialogTitle>
            <DialogDescription>
              We found an existing report that might be the same issue. Please confirm if this is the same problem.
            </DialogDescription>
          </DialogHeader>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              We found a similar report in the system. Is this the same issue?
            </AlertDescription>
          </Alert>

          {similarReport && (
            <Card className="p-4">
              <div className="flex gap-4">
                <img
                  src={similarReport.image}
                  alt={similarReport.title}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="text-slate-900 mb-2">{similarReport.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{similarReport.description}</p>
                  <p className="text-sm text-slate-500">
                    <MapPin className="w-3 h-3 inline mr-1" />
                    {similarReport.location.address}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {similarReport.complaintCount} people have reported this
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSimilarCheck(false);
                submitNewReport();
              }}
            >
              No, Submit New Report
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={incrementExistingReport}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Yes, Same Issue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
