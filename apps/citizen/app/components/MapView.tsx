import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getAllReports } from '../data/mockData';
import { Report } from '../types/report';
import { ReportDetailsModal } from './ReportDetailsModal';
import { MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

export function MapView() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const reports = getAllReports();

  const getMarkerColor = (report: Report) => {
    if (report.status === 'in-progress') return '#22c55e'; // Green
    if (report.complaintCount >= 10) return '#ef4444'; // Red - high complaints
    if (report.complaintCount >= 5) return '#f59e0b'; // Yellow - medium complaints
    return '#3b82f6'; // Blue - low complaints
  };

  const getMarkerLabel = (report: Report) => {
    if (report.status === 'in-progress') return 'In Progress';
    if (report.complaintCount >= 10) return 'High Priority';
    if (report.complaintCount >= 5) return 'Medium Priority';
    return 'Low Priority';
  };

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  // Normalize coordinates to fit in our SVG viewport
  const normalizeCoordinates = (lat: number, lng: number) => {
    // Map real coordinates to our 800x600 viewport
    const minLat = 40.70;
    const maxLat = 40.78;
    const minLng = -74.08;
    const maxLng = -73.96;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 50;
    
    return { x, y };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Area Map View</h2>
          <p className="text-slate-600 text-sm">Click on markers to view report details</p>
        </div>
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

      {/* Legend */}
      <Card className="p-4">
        <h4 className="mb-3 text-slate-700">Map Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-slate-600">High Priority (10+ reports)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-slate-600">Medium Priority (5-9 reports)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-slate-600">Low Priority (&lt;5 reports)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-slate-600">In Progress</span>
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
            {reports.map((report) => {
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
                  onClick={() => handleMarkerClick(report)}
                >
                  {/* Marker pin */}
                  <path
                    d="M0,-20 C-5.5,-20 -10,-15.5 -10,-10 C-10,-5 0,0 0,0 C0,0 10,-5 10,-10 C10,-15.5 5.5,-20 0,-20 Z"
                    fill={getMarkerColor(report)}
                    stroke="white"
                    strokeWidth="2"
                  />
                  {/* Count badge */}
                  <circle cx="0" cy="-10" r="6" fill="white" />
                  <text
                    x="0"
                    y="-7"
                    textAnchor="middle"
                    fontSize="8"
                    fontWeight="bold"
                    fill={getMarkerColor(report)}
                  >
                    {report.complaintCount}
                  </text>
                  
                  {/* Hover tooltip */}
                  {isHovered && (
                    <g transform="translate(15, -30)">
                      <rect
                        x="0"
                        y="0"
                        width="180"
                        height="60"
                        fill="white"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        rx="4"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                      />
                      <text x="8" y="15" fontSize="11" fontWeight="600" fill="#0f172a">
                        {report.title.slice(0, 25)}...
                      </text>
                      <text x="8" y="30" fontSize="9" fill="#64748b">
                        {report.location.address.slice(0, 30)}...
                      </text>
                      <text x="8" y="45" fontSize="9" fill="#64748b">
                        Status: {report.status}
                      </text>
                      <text x="8" y="55" fontSize="8" fontWeight="500" fill={getMarkerColor(report)}>
                        {getMarkerLabel(report)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Active Reports Counter */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-slate-900">{reports.length}</p>
              <p className="text-xs text-slate-600">Active Reports</p>
            </div>
          </div>
        </div>
      </Card>

      <ReportDetailsModal
        report={selectedReport}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
