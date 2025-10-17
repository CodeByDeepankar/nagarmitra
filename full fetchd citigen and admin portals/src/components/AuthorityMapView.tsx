import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Report } from '../types/report';
import { ReportDetailsModal } from './ReportDetailsModal';
import { ProgressUpdateModal } from './ProgressUpdateModal';
import { MapPin, ZoomIn, ZoomOut, Filter, Eye, Edit2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AuthorityMapViewProps {
  reports: Report[];
  onReportUpdate?: (report: Report) => void;
}

export function AuthorityMapView({ reports, onReportUpdate }: AuthorityMapViewProps) {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Filter reports based on selected filters
  const filteredReports = reports.filter(report => {
    if (statusFilter !== 'all' && report.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && report.priority !== priorityFilter) return false;
    return true;
  });

  const getMarkerColor = (report: Report) => {
    // Status-based coloring for Authority
    if (report.status === 'resolved') return '#22c55e'; // Green
    if (report.status === 'in-progress') return '#f59e0b'; // Yellow
    if (report.status === 'rejected') return '#64748b'; // Grey
    if (report.status === 'pending') {
      // Priority-based for pending
      if (report.priority === 'critical') return '#dc2626'; // Dark red
      if (report.priority === 'high') return '#ef4444'; // Red
      if (report.priority === 'medium') return '#f97316'; // Orange
      return '#3b82f6'; // Blue
    }
    return '#3b82f6';
  };

  const getStatusBadgeColor = (status: Report['status']) => {
    const colors: Record<string, string> = {
      'pending': 'bg-red-100 text-red-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'resolved': 'bg-green-100 text-green-800',
      'rejected': 'bg-slate-100 text-slate-800',
    };
    return colors[status] || colors.pending;
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setDetailsModalOpen(true);
  };

  const handleUpdateProgress = (report: Report) => {
    setSelectedReport(report);
    setUpdateModalOpen(true);
  };

  const handleProgressUpdate = (updatedReport: Report) => {
    onReportUpdate?.(updatedReport);
  };

  // Normalize coordinates to fit in our SVG viewport
  const normalizeCoordinates = (lat: number, lng: number) => {
    const minLat = 40.70;
    const maxLat = 40.78;
    const minLng = -74.08;
    const maxLng = -73.96;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 50;
    
    return { x, y };
  };

  // Calculate statistics
  const stats = {
    total: filteredReports.length,
    pending: filteredReports.filter(r => r.status === 'pending').length,
    inProgress: filteredReports.filter(r => r.status === 'in-progress').length,
    resolved: filteredReports.filter(r => r.status === 'resolved').length,
    critical: filteredReports.filter(r => r.priority === 'critical').length,
  };

  return (
    <div className="space-y-4">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-slate-900">Geographic Report Distribution</h2>
          <p className="text-slate-600 text-sm">Monitor and manage all civic issues on the map</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Zoom Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-4 border-l-4 border-blue-500">
          <p className="text-xs text-slate-600">Total Reports</p>
          <p className="text-slate-900 mt-1">{stats.total}</p>
        </Card>
        <Card className="p-4 border-l-4 border-red-500">
          <p className="text-xs text-slate-600">Pending</p>
          <p className="text-slate-900 mt-1">{stats.pending}</p>
        </Card>
        <Card className="p-4 border-l-4 border-yellow-500">
          <p className="text-xs text-slate-600">In Progress</p>
          <p className="text-slate-900 mt-1">{stats.inProgress}</p>
        </Card>
        <Card className="p-4 border-l-4 border-green-500">
          <p className="text-xs text-slate-600">Resolved</p>
          <p className="text-slate-900 mt-1">{stats.resolved}</p>
        </Card>
        <Card className="p-4 border-l-4 border-rose-600">
          <p className="text-xs text-slate-600">Critical</p>
          <p className="text-slate-900 mt-1">{stats.critical}</p>
        </Card>
      </div>

      {/* Enhanced Legend */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h4 className="mb-3 text-slate-700">Status Indicators</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-slate-600">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                <span className="text-slate-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-500"></div>
                <span className="text-slate-600">Rejected</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="mb-3 text-slate-700">Priority Levels (Pending)</h4>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-700"></div>
                <span className="text-slate-600">Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-slate-600">High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-slate-600">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span className="text-slate-600">Low</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Map Container */}
      <Card className="relative overflow-hidden bg-slate-50">
        <div className="w-full h-[600px] relative">
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
          >
            {/* Grid background */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="800" height="600" fill="url(#grid)" />
            
            {/* City blocks simulation */}
            <g opacity="0.1">
              <rect x="100" y="100" width="150" height="100" fill="#64748b" />
              <rect x="300" y="150" width="120" height="80" fill="#64748b" />
              <rect x="500" y="100" width="180" height="120" fill="#64748b" />
              <rect x="150" y="300" width="140" height="90" fill="#64748b" />
              <rect x="400" y="350" width="160" height="100" fill="#64748b" />
              <rect x="100" y="450" width="130" height="70" fill="#64748b" />
            </g>

            {/* Roads */}
            <g stroke="#cbd5e1" strokeWidth="3" fill="none" opacity="0.3">
              <line x1="0" y1="200" x2="800" y2="200" />
              <line x1="0" y1="400" x2="800" y2="400" />
              <line x1="250" y1="0" x2="250" y2="600" />
              <line x1="450" y1="0" x2="450" y2="600" />
              <line x1="650" y1="0" x2="650" y2="600" />
            </g>

            {/* Report Markers */}
            {filteredReports.map((report) => {
              const { x, y } = normalizeCoordinates(report.location.lat, report.location.lng);
              const isHovered = hoveredMarker === report.id;
              
              return (
                <g
                  key={report.id}
                  transform={`translate(${x}, ${y})`}
                  className="cursor-pointer transition-transform"
                  style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
                  onMouseEnter={() => setHoveredMarker(report.id)}
                  onMouseLeave={() => setHoveredMarker(null)}
                >
                  {/* Marker pin */}
                  <path
                    d="M0,-20 C-5.5,-20 -10,-15.5 -10,-10 C-10,-5 0,0 0,0 C0,0 10,-5 10,-10 C10,-15.5 5.5,-20 0,-20 Z"
                    fill={getMarkerColor(report)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Priority badge */}
                  <circle cx="0" cy="-10" r="6" fill="white" />
                  <text
                    x="0"
                    y="-7"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill={getMarkerColor(report)}
                  >
                    {report.priority === 'critical' ? '!' : report.priority === 'high' ? 'H' : report.priority === 'medium' ? 'M' : 'L'}
                  </text>
                  
                  {/* Hover tooltip with actions */}
                  {isHovered && (
                    <g transform="translate(15, -40)">
                      <rect
                        x="0"
                        y="0"
                        width="220"
                        height="90"
                        fill="white"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        rx="4"
                        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                      />
                      <text x="8" y="15" fontSize="11" fontWeight="600" fill="#0f172a">
                        {report.title.slice(0, 28)}...
                      </text>
                      <text x="8" y="30" fontSize="9" fill="#64748b">
                        {report.location.address.slice(0, 35)}...
                      </text>
                      <text x="8" y="45" fontSize="9" fill="#64748b">
                        Reporter: {report.submittedBy}
                      </text>
                      
                      {/* Status Badge */}
                      <rect x="8" y="52" width="60" height="16" fill={getMarkerColor(report)} rx="8" opacity="0.2" />
                      <text x="38" y="63" fontSize="8" fontWeight="600" fill={getMarkerColor(report)} textAnchor="middle">
                        {report.status.toUpperCase()}
                      </text>
                      
                      {/* Action buttons */}
                      <g onClick={() => handleViewDetails(report)} className="cursor-pointer">
                        <rect x="8" y="72" width="95" height="14" fill="#3b82f6" rx="3" opacity="0.9" />
                        <text x="55" y="82" fontSize="8" fill="white" textAnchor="middle" fontWeight="600">
                          👁 View Details
                        </text>
                      </g>
                      
                      <g onClick={() => handleUpdateProgress(report)} className="cursor-pointer">
                        <rect x="110" y="72" width="100" height="14" fill="#10b981" rx="3" opacity="0.9" />
                        <text x="160" y="82" fontSize="8" fill="white" textAnchor="middle" fontWeight="600">
                          ✏️ Update
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Active Reports Counter */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-slate-900">{filteredReports.length}</p>
              <p className="text-xs text-slate-600">
                {statusFilter === 'all' ? 'Total' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Reports
              </p>
            </div>
          </div>
        </div>

        {/* No Results Message */}
        {filteredReports.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-900 mb-1">No reports found</p>
              <p className="text-sm text-slate-600">Try adjusting your filters</p>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <ReportDetailsModal
        report={selectedReport}
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
      />

      <ProgressUpdateModal
        report={selectedReport}
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        onUpdate={handleProgressUpdate}
      />
    </div>
  );
}
