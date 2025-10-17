# Audio Recording Upload Feature

## Overview
Updated the voice recording feature to capture and upload actual audio files instead of simulated speech-to-text conversion.

## ✅ Implementation Complete

### 1. **Audio File Recording**
- Records audio using MediaRecorder API
- Saves as WebM format (browser-compatible)
- Creates a File object with timestamp: `voice-note-{timestamp}.webm`
- Stores audio blob for preview and upload

### 2. **Audio Preview Player**
- Shows after recording is complete
- Blue card UI with microphone icon
- HTML5 audio element with native controls
- Delete button to remove recording
- URL cleanup on removal

### 3. **Supabase Storage Upload**
- Uploads to `issue-audio` storage bucket
- File path: `{user_id}/{timestamp}_{filename}`
- Generates public URL for database storage
- Graceful error handling (continues submission if audio fails)

### 4. **Database Integration**
- Added `audio_url` column to `issues` table
- Stores public URL of uploaded audio file
- Nullable field (optional audio attachment)

## 📝 Database Migration Required

Run this SQL in your Supabase SQL Editor:

```sql
-- Add audio_url column to issues table
ALTER TABLE issues 
ADD COLUMN audio_url TEXT;

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public)
VALUES ('issue-audio', 'issue-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for issue-audio bucket
CREATE POLICY "Public Access for issue-audio"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-audio');

CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'issue-audio');

CREATE POLICY "Users can update own audio"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'issue-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'issue-audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create an index on audio_url for better query performance
CREATE INDEX idx_issues_audio_url ON issues(audio_url) WHERE audio_url IS NOT NULL;
```

## 🎨 UI Components

### Recording Button
```tsx
<Button
  type="button"
  variant="ghost"
  size="sm"
  onClick={toggleVoiceRecording}
  className={`absolute right-2 top-2 ${isRecording ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}
>
  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
</Button>
```

### Audio Preview Player
```tsx
{audioPreviewUrl && (
  <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Mic className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-900">Voice Recording</p>
          <audio controls src={audioPreviewUrl} className="w-full mt-2 h-8" />
        </div>
      </div>
      <Button onClick={removeAudioRecording}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  </div>
)}
```

## 🔧 Code Changes

### State Management
```typescript
const [audioFile, setAudioFile] = useState<File | null>(null);
const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>("");
```

### Recording Logic
```typescript
const startVoiceRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    const audioFile = new File([audioBlob], `voice-note-${Date.now()}.webm`, { 
      type: 'audio/webm' 
    });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    setAudioFile(audioFile);
    setAudioPreviewUrl(audioUrl);
  };
  
  mediaRecorder.start();
};
```

### Upload Logic
```typescript
let audioUrl = "";
if (audioFile) {
  const audioFileName = `${user.id}/${Date.now()}_${audioFile.name}`;
  const { error: audioUploadError } = await supabase.storage
    .from('issue-audio')
    .upload(audioFileName, audioFile);

  if (!audioUploadError) {
    const { data: { publicUrl } } = supabase.storage
      .from('issue-audio')
      .getPublicUrl(audioFileName);
    audioUrl = publicUrl;
  }
}

// Insert with audio_url
await supabase.from('issues').insert({
  // ... other fields
  audio_url: audioUrl || null,
});
```

## 📊 TypeScript Types Updated

```typescript
// packages/lib/types.ts
export interface Issue {
  // ... other fields
  audio_url: string | null;
}
```

## 🎯 Features

✅ Record audio with microphone
✅ Play back recorded audio before submission
✅ Remove and re-record
✅ Upload to Supabase storage
✅ Store URL in database
✅ Optional field (not required)
✅ Error handling for failed uploads
✅ Memory cleanup (URL.revokeObjectURL)

## 🧪 Testing Steps

1. **Run Migration**: Execute the SQL migration in Supabase
2. **Test Recording**:
   - Click microphone icon
   - Grant microphone permissions
   - Speak for a few seconds
   - Click microphone again to stop
3. **Test Preview**:
   - Verify audio player appears
   - Play back the recording
   - Check audio quality
4. **Test Removal**:
   - Click trash icon
   - Verify audio is removed
   - Record again to test multiple recordings
5. **Test Upload**:
   - Fill out entire form
   - Submit report
   - Check Supabase storage for audio file
   - Verify `audio_url` in issues table
6. **Test Playback in Dashboard**:
   - View submitted issue
   - Play audio recording from stored URL

## 🌐 Browser Support

- ✅ Chrome/Edge (WebM/Opus)
- ✅ Firefox (WebM/Opus)
- ✅ Safari (WebM with iOS 14.3+)
- ⚠️ Requires HTTPS in production
- ⚠️ Microphone permissions required

## 📁 Files Modified

1. `apps/citizen/app/report/page.tsx`
   - Added audio recording state
   - Implemented recording functions
   - Added audio preview UI
   - Updated form submission

2. `packages/lib/types.ts`
   - Added `audio_url` to Issue type

3. `supabase-migrations-audio-upload.sql`
   - Database migration script

## 🚀 Production Considerations

1. **Audio Format**: WebM is widely supported but consider MP3 conversion for older devices
2. **File Size**: Monitor audio file sizes, consider compression
3. **Storage Costs**: Audio files can be large, implement cleanup policies
4. **Transcription**: Consider adding real speech-to-text for accessibility
5. **Duration Limits**: Add max recording duration to prevent abuse
6. **Progress Indicator**: Show upload progress for large files

---

**Status**: ✅ Complete - Ready for Testing
**Date**: October 18, 2025
**Migration Required**: Yes (run SQL before testing)
