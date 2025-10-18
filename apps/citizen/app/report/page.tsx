"use client";

import { useState, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Autocomplete from "react-google-autocomplete";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { supabase } from "@repo/lib/supabaseClient";
import ProtectedRoute from "../components/ProtectedRoute";
import toast from "react-hot-toast";
import { 
  Camera, 
  MapPin, 
  FileText, 
  AlertCircle, 
  Upload,
  Loader2,
  CheckCircle,
  X,
  Info,
  AlertTriangle,
  Mic,
  MicOff,
  Play,
  Trash2
} from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";
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

const CATEGORIES = [
  { value: "pothole", label: "Pothole", icon: "🕳️" },
  { value: "streetlight", label: "Street Light", icon: "💡" },
  { value: "garbage", label: "Garbage Collection", icon: "🗑️" },
  { value: "water", label: "Water Supply", icon: "💧" },
  { value: "drainage", label: "Drainage", icon: "🚰" },
  { value: "other", label: "Other", icon: "📋" },
];

function ReportPageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [duplicateIssues, setDuplicateIssues] = useState<any[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [proceedWithSubmission, setProceedWithSubmission] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setFormData({
          ...formData,
          latitude,
          longitude,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setFormData((prev) => ({
              ...prev,
              location: data.display_name,
            }));
          }
        } catch (error) {
          console.error("Error getting address:", error);
        }

        setGettingLocation(false);
        toast.success("Location captured successfully!");
      },
      (error) => {
        setGettingLocation(false);
        let errorMessage = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioFile(audioFile);
        setAudioPreviewUrl(audioUrl);
        toast.success('Voice recording saved! You can play it back below.');
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording... Click the microphone again to stop', {
        icon: '🎤',
        duration: 2000,
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const removeAudioRecording = () => {
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioFile(null);
    setAudioPreviewUrl("");
    toast.success('Voice recording removed');
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!imageFile) {
      newErrors.image = "Please upload an image of the issue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check for duplicate issues
  const checkForDuplicates = async () => {
    if (!formData.title || formData.title.length < 10) {
      return [];
    }

    setCheckingDuplicates(true);
    try {
      // Search for similar issues by title, category, and location
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('category', formData.category)
        .neq('status', 'Resolved')
        .neq('status', 'Rejected')
        .ilike('title', `%${formData.title.split(' ').slice(0, 3).join('%')}%`)
        .limit(5);

      if (error) throw error;

      // Filter by location similarity if coordinates available
      let similarIssues = data || [];
      if (formData.latitude && formData.longitude) {
        similarIssues = similarIssues.filter((issue: any) => {
          if (!issue.latitude || !issue.longitude) return false;
          const distance = Math.sqrt(
            Math.pow(issue.latitude - formData.latitude!, 2) +
            Math.pow(issue.longitude - formData.longitude!, 2)
          );
          // Within approximately 0.5km radius (rough calculation)
          return distance < 0.005;
        });
      }

      return similarIssues;
    } catch (error) {
      console.error('Error checking duplicates:', error);
      return [];
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Check for duplicates before submitting (unless user already confirmed)
    if (!proceedWithSubmission) {
      const duplicates = await checkForDuplicates();
      if (duplicates.length > 0) {
        setDuplicateIssues(duplicates);
        setShowDuplicateDialog(true);
        return;
      }
    }

    // Reset the proceed flag
    setProceedWithSubmission(false);

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to report an issue");
        router.push("/auth/signin");
        return;
      }

      let imageUrl = "";
      if (imageFile) {
        const fileName = `${user.id}/${Date.now()}_${imageFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('issue-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('issue-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      let audioUrl = "";
      if (audioFile) {
        const audioFileName = `${user.id}/${Date.now()}_${audioFile.name}`;
        const { data: audioUploadData, error: audioUploadError } = await supabase.storage
          .from('issue-audio')
          .upload(audioFileName, audioFile);

        if (audioUploadError) {
          console.error('Audio upload error:', audioUploadError);
          toast.error('Failed to upload audio recording, but continuing with submission');
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('issue-audio')
            .getPublicUrl(audioFileName);
          
          audioUrl = publicUrl;
        }
      }

      const { error: insertError } = await supabase
        .from('issues')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          image_url: imageUrl,
          audio_url: audioUrl || null,
          latitude: formData.latitude,
          longitude: formData.longitude,
          location: formData.location ? { address: formData.location } : null,
          status: 'Pending',
          priority: 'low', // Default priority
          complaint_count: 1, // Initial count
        });

      if (insertError) {
        throw insertError;
      }

      toast.success("Issue reported successfully! 🎉");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error reporting issue:", error);
      toast.error(error.message || "Failed to report issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Main Form */}
        <Card className="shadow-xl border-0">
          <CardHeader className="border-b">
            <CardTitle className="text-2xl text-gray-800">Report a New Issue</CardTitle>
            <CardDescription className="text-gray-700">
              Submit details about a civic problem in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-800">
                  Upload Image *
                </Label>
                {!imagePreview ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Upload className="w-8 h-8 text-slate-500" />
                      </div>
                      <p className="text-gray-800 font-medium mb-1">Click to upload image</p>
                      <p className="text-sm text-gray-700">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg max-h-96 object-cover border-2 border-slate-200"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2 shadow-lg"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                )}
                {errors.image && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold text-gray-800">
                  Issue Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold text-gray-800">
                  Detailed Description *
                </Label>
                <div className="relative">
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the issue... (or use voice input)"
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) setErrors({ ...errors, description: "" });
                    }}
                    rows={5}
                    className={`pr-12 ${errors.description ? 'border-red-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoiceRecording}
                    className={`absolute right-2 top-2 ${isRecording ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}
                    title={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-700">
                  Click the microphone icon to record a voice note that will be attached to your report
                </p>
                
                {/* Audio Preview Player */}
                {audioPreviewUrl && (
                  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mic className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">Voice Recording</p>
                          <audio 
                            controls 
                            src={audioPreviewUrl} 
                            className="w-full mt-2 h-8"
                            style={{ maxWidth: '300px' }}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeAudioRecording}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {errors.description && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold text-gray-800">
                  Category *
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value: string) => {
                    setFormData({ ...formData, category: value });
                    if (errors.category) setErrors({ ...errors, category: "" });
                  }}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select issue category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label className="text-base font-semibold text-gray-800">
                  Location *
                </Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    {GOOGLE_MAPS_KEY ? (
                      <Autocomplete
                        apiKey={GOOGLE_MAPS_KEY}
                        placeholder="Enter address or get current location"
                        className="w-full h-9 rounded-md border border-gray-300 px-3 py-1 text-base text-gray-900 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        onPlaceSelected={(place) => {
                          const address = place?.formatted_address || place?.name || "";
                          const lat = place?.geometry?.location?.lat?.();
                          const lng = place?.geometry?.location?.lng?.();

                          setFormData((prev) => ({
                            ...prev,
                            location: address,
                            latitude: typeof lat === 'number' ? lat : prev.latitude,
                            longitude: typeof lng === 'number' ? lng : prev.longitude,
                          }));
                        }}
                        options={{
                          fields: ["formatted_address", "geometry", "name"],
                          types: ["geocode"],
                          // componentRestrictions: { country: "IN" },
                        }}
                        // ensure Places library
                        libraries={["places"]}
                      />
                    ) : (
                      <>
                        <Input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="Enter address (enable Google Places by setting NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)"
                          className="flex-1"
                        />
                        <p className="mt-1 text-xs text-amber-700">Autocomplete disabled: missing Google Maps API key</p>
                      </>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={getCurrentLocation}
                    disabled={gettingLocation}
                    variant="outline"
                    className="whitespace-nowrap gap-2"
                  >
                    {gettingLocation ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Getting...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
                        Get Location
                      </>
                    )}
                  </Button>
                </div>
                {formData.latitude && formData.longitude && (
                  <p className="text-sm text-gray-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    Coordinates: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || checkingDuplicates}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading || checkingDuplicates ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {checkingDuplicates ? 'Checking...' : 'Submitting...'}
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Duplicate Detection Dialog */}
        <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
          <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl">Similar Issues Found</AlertDialogTitle>
                  <p className="text-sm text-gray-500">We found {duplicateIssues.length} similar report(s)</p>
                </div>
              </div>
              <AlertDialogDescription className="text-base">
                These existing reports appear similar to yours. Would you like to support an existing report instead of creating a new one?
                Supporting an existing report helps authorities prioritize issues better.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="space-y-3 my-4">
              {duplicateIssues.map((issue) => (
                <Card key={issue.id} className="border-yellow-200 bg-yellow-50/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {issue.image_url && (
                        <img 
                          src={issue.image_url} 
                          alt={issue.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{issue.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {issue.location?.address || 'No location'}
                          </span>
                          <span className={`px-2 py-1 rounded-full font-medium ${
                            issue.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.status}
                          </span>
                          {issue.complaint_count && issue.complaint_count > 1 && (
                            <span className="flex items-center gap-1 text-orange-600 font-medium">
                              {issue.complaint_count} reports
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={() => {
                setShowDuplicateDialog(false);
                setDuplicateIssues([]);
              }}>
                Cancel
              </AlertDialogCancel>
              <Button
                variant="outline"
                onClick={() => {
                  setProceedWithSubmission(true);
                  setShowDuplicateDialog(false);
                  // Trigger form submission
                  setTimeout(() => {
                    document.querySelector('form')?.requestSubmit();
                  }, 100);
                }}
              >
                Submit New Report Anyway
              </Button>
              <AlertDialogAction
                onClick={async () => {
                  // Increment complaint count of the first similar issue
                  if (duplicateIssues[0]) {
                    try {
                      const newCount = (duplicateIssues[0].complaint_count || 1) + 1;
                      const newPriority = newCount >= 10 ? 'high' : newCount >= 5 ? 'medium' : 'low';
                      
                      await supabase
                        .from('issues')
                        .update({ 
                          complaint_count: newCount,
                          priority: newPriority
                        })
                        .eq('id', duplicateIssues[0].id);
                      
                      toast.success('Your support has been added to the existing report! 🎉');
                      router.push('/dashboard');
                    } catch (error) {
                      console.error('Error updating complaint count:', error);
                      toast.error('Failed to support existing report');
                    }
                  }
                  setShowDuplicateDialog(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Support Existing Report
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <ReportPageContent />
    </ProtectedRoute>
  );
}
