import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, CheckCheck, Trash2, AlertCircle, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { format } from '../utils/date';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'update' | 'comment' | 'completed' | 'new' | 'overdue';
  reportId?: string;
  isRead: boolean;
  timestamp: Date;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Report Status Updated',
    message: 'Your report "Large pothole on Main Street" has been marked as resolved',
    type: 'completed',
    reportId: '1',
    isRead: false,
    timestamp: new Date('2024-02-01T14:30:00'),
  },
  {
    id: 'notif-2',
    title: 'New Comment',
    message: 'Authority has added a comment to your report "Broken streetlight near park"',
    type: 'comment',
    reportId: '2',
    isRead: false,
    timestamp: new Date('2024-02-12T09:15:00'),
  },
  {
    id: 'notif-3',
    title: 'Work in Progress',
    message: 'Work has started on "Clogged drainage system"',
    type: 'update',
    reportId: '3',
    isRead: true,
    timestamp: new Date('2024-02-20T17:00:00'),
  },
  {
    id: 'notif-4',
    title: 'Report Received',
    message: 'Your report "Clogged drainage system" has been successfully submitted',
    type: 'new',
    reportId: '3',
    isRead: true,
    timestamp: new Date('2024-02-20T16:50:00'),
  },
];

interface NotificationsPageProps {
  userType: 'civilian' | 'authority';
}

export function NotificationsPage({ userType }: NotificationsPageProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'update':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-slate-900">Notifications</h2>
            <p className="text-slate-600">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All as Read
          </Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-3 mt-6">
          {filteredNotifications.length === 0 ? (
            <Card className="p-12">
              <div className="text-center text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                <p>No {filter === 'unread' ? 'unread' : ''} notifications</p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-all ${
                  !notification.isRead 
                    ? 'border-l-4 border-l-blue-600 bg-blue-50/30' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-slate-900">{notification.title}</h4>
                      {!notification.isRead && (
                        <Badge className="bg-blue-100 text-blue-800 flex-shrink-0">New</Badge>
                      )}
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500">
                        {format(new Date(notification.timestamp), 'PPpp')}
                      </p>
                      <div className="flex gap-2">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark as Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
