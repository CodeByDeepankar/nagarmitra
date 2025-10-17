import { Card } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts@2.14.1';
import { getAllReports } from '../data/mockData';

export function AnalyticsCharts() {
  const reports = getAllReports();

  // Reports by Category
  const categoryData = [
    { name: 'Potholes', value: reports.filter(r => r.category === 'potholes').length },
    { name: 'Streetlight', value: reports.filter(r => r.category === 'streetlight').length },
    { name: 'Drainage', value: reports.filter(r => r.category === 'drainage').length },
    { name: 'Garbage', value: reports.filter(r => r.category === 'garbage').length },
    { name: 'Water Supply', value: reports.filter(r => r.category === 'water-supply').length },
    { name: 'Road Damage', value: reports.filter(r => r.category === 'road-damage').length },
  ].filter(d => d.value > 0);

  // Reports by Status
  const statusData = [
    { name: 'Pending', value: reports.filter(r => r.status === 'pending').length, fill: '#ef4444' },
    { name: 'In Progress', value: reports.filter(r => r.status === 'in-progress').length, fill: '#f59e0b' },
    { name: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, fill: '#22c55e' },
  ];

  // Trend Data (mock monthly data)
  const trendData = [
    { month: 'Jan', reports: 12, resolved: 8 },
    { month: 'Feb', reports: 19, resolved: 15 },
    { month: 'Mar', reports: 15, resolved: 12 },
    { month: 'Apr', reports: 22, resolved: 18 },
    { month: 'May', reports: 18, resolved: 14 },
    { month: 'Jun', reports: 25, resolved: 20 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-slate-900 mb-2">Analytics & Reports</h2>
        <p className="text-slate-600">Visual insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Reports by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6">
          <h3 className="text-slate-900 mb-4">Reports by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Trend Analysis */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-slate-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} name="Total Reports" />
              <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
