import { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Settings, Moon, Sun, Globe, Bell, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SettingsPageProps {
  userType: 'civilian' | 'authority';
}

export function SettingsPage({ userType }: SettingsPageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h2 className="text-slate-900">Settings</h2>
          <p className="text-slate-600">Manage your application preferences</p>
        </div>
      </div>

      {/* Appearance */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sun className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Appearance</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="darkMode">Dark Mode</Label>
              <p className="text-sm text-slate-500">Switch between light and dark theme</p>
            </div>
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Color Theme</Label>
            <Select defaultValue="blue">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blue">Blue (Default)</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Language */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Language & Region</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="es">🇪🇸 Español</SelectItem>
                <SelectItem value="hi">🇮🇳 हिन्दी</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select defaultValue="utc-5">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc-5">UTC-5 (Eastern Time)</SelectItem>
                <SelectItem value="utc-6">UTC-6 (Central Time)</SelectItem>
                <SelectItem value="utc-7">UTC-7 (Mountain Time)</SelectItem>
                <SelectItem value="utc-8">UTC-8 (Pacific Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-slate-600" />
          <h3 className="text-slate-900">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotif">Email Notifications</Label>
              <p className="text-sm text-slate-500">Receive updates via email</p>
            </div>
            <Switch
              id="emailNotif"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="pushNotif">Push Notifications</Label>
              <p className="text-sm text-slate-500">Get instant updates on your device</p>
            </div>
            <Switch
              id="pushNotif"
              checked={pushNotifications}
              onCheckedChange={setPushNotifications}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound">Sound</Label>
              <p className="text-sm text-slate-500">Play sound for notifications</p>
            </div>
            <Switch
              id="sound"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security (Authority only) */}
      {userType === 'authority' && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-slate-600" />
            <h3 className="text-slate-900">Privacy & Security</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">Add an extra layer of security</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Change Password</Label>
                <p className="text-sm text-slate-500">Update your account password</p>
              </div>
              <Button variant="outline" size="sm">Change</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Reset to Default</Button>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
