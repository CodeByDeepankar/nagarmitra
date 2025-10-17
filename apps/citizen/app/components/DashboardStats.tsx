import { Card } from './ui/card';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { getAllUserReports } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

export function DashboardStats() {
  const { t } = useLanguage();
  const reports = getAllUserReports();
  
  const stats = {
    total: reports.length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    pending: reports.filter(r => r.status === 'pending').length,
  };

  const statCards = [
    {
      title: t('stats.total'),
      value: stats.total,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: t('stats.resolved'),
      value: stats.resolved,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: t('stats.inProgress'),
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      title: t('stats.pending'),
      value: stats.pending,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`p-6 border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-slate-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
