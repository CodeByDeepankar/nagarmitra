import { Card } from './ui/card';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  LogOut,
  Edit,
  Award,
  FileText,
  CheckCircle2
} from 'lucide-react';
import { CURRENT_USER } from '../data/mockData';
import { getAllUserReports } from '../data/mockData';
import { format } from '../utils/date';

interface ProfilePageProps {
  userType: 'civilian' | 'authority';
  onLogout?: () => void;
}

export function ProfilePage({ userType, onLogout }: ProfilePageProps) {
  const reports = getAllUserReports();
  const stats = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
  };

  const userInitials = CURRENT_USER
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-slate-900 mb-1">{CURRENT_USER}</h2>
              <Badge className="mb-3">
                {userType === 'civilian' ? 'Civilian User' : 'Authority Admin'}
              </Badge>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{CURRENT_USER.toLowerCase().replace(' ', '.')}@email.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since January 2024</span>
                </div>
              </div>
            </div>
          </div>
          <Button variant="outline">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </Card>

      {/* Statistics (Civilian only) */}
      {userType === 'civilian' && (
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Your Impact
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl text-blue-900">{stats.total}</p>
              <p className="text-sm text-blue-700">Total Reports</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl text-green-900">{stats.resolved}</p>
              <p className="text-sm text-green-700">Resolved</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl text-yellow-900">{stats.inProgress}</p>
              <p className="text-sm text-yellow-700">In Progress</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-2xl text-red-900">{stats.pending}</p>
              <p className="text-sm text-red-700">Pending</p>
            </div>
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {reports.slice(0, 5).map((report) => (
            <div key={report.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
              <img 
                src={report.image} 
                alt={report.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-slate-900 line-clamp-1">{report.title}</p>
                <p className="text-sm text-slate-600 line-clamp-1">{report.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {format(new Date(report.submittedAt), 'PPP')}
                </p>
              </div>
              <Badge className={
                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {report.status.replace('-', ' ')}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="p-6">
        <h3 className="text-slate-900 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <User className="w-4 h-4 mr-2" />
            Update Profile Information
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Mail className="w-4 h-4 mr-2" />
            Change Email Address
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Phone className="w-4 h-4 mr-2" />
            Update Phone Number
          </Button>
          <Separator />
          <Button 
            variant="outline" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log Out
          </Button>
        </div>
      </Card>
    </div>
  );
}
