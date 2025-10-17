import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Star, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Feedback } from '../types/feedback';
import { CURRENT_USER } from '../data/mockData';

interface FeedbackModalProps {
  reportId: string;
  reportTitle: string;
  open: boolean;
  onClose: () => void;
}

export function FeedbackModal({ reportId, reportTitle, open, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [wasProperlyFixed, setWasProperlyFixed] = useState('');
  const [satisfiedWithTime, setSatisfiedWithTime] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (!wasProperlyFixed || !satisfiedWithTime) {
      toast.error('Please answer all questions');
      return;
    }

    const feedback: Feedback = {
      id: `feedback-${Date.now()}`,
      reportId,
      userId: 'user-1',
      userName: CURRENT_USER,
      rating,
      comment,
      wasProperlyFixed: wasProperlyFixed as 'yes' | 'no' | 'somewhat',
      satisfiedWithTime: satisfiedWithTime as 'yes' | 'no' | 'somewhat',
      submittedAt: new Date(),
    };

    // Simulate API call
    console.log('Submitting feedback:', feedback);
    toast.success('Thank you for your feedback!');
    
    // Reset form
    setRating(0);
    setComment('');
    setWasProperlyFixed('');
    setSatisfiedWithTime('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
          <DialogDescription>
            How satisfied are you with the resolution of "{reportTitle}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-slate-700 self-center">
                  {rating === 5 && '🎉 Excellent'}
                  {rating === 4 && '😊 Good'}
                  {rating === 3 && '😐 Average'}
                  {rating === 2 && '😞 Poor'}
                  {rating === 1 && '😠 Very Poor'}
                </span>
              )}
            </div>
          </div>

          {/* Was Properly Fixed */}
          <div className="space-y-3">
            <Label>Was the issue properly fixed? *</Label>
            <RadioGroup value={wasProperlyFixed} onValueChange={setWasProperlyFixed}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="fixed-yes" />
                <Label htmlFor="fixed-yes" className="cursor-pointer">Yes, completely fixed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="fixed-somewhat" />
                <Label htmlFor="fixed-somewhat" className="cursor-pointer">Somewhat, but could be better</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="fixed-no" />
                <Label htmlFor="fixed-no" className="cursor-pointer">No, still having issues</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Satisfied with Time */}
          <div className="space-y-3">
            <Label>Are you satisfied with the resolution time? *</Label>
            <RadioGroup value={satisfiedWithTime} onValueChange={setSatisfiedWithTime}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="time-yes" />
                <Label htmlFor="time-yes" className="cursor-pointer">Yes, it was quick</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="somewhat" id="time-somewhat" />
                <Label htmlFor="time-somewhat" className="cursor-pointer">It was acceptable</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="time-no" />
                <Label htmlFor="time-no" className="cursor-pointer">No, it took too long</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Additional Comments */}
          <div className="space-y-2">
            <Label htmlFor="comment">Additional Comments (Optional)</Label>
            <Textarea
              id="comment"
              placeholder="Share your experience or suggestions..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4 mr-2" />
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
