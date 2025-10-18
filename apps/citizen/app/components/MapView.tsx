'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { ReportDetailsModal } from './ReportDetailsModal';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Custom icons
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Cluster icon function
const iconCreateFunction = (cluster: any) => {
  const count = cluster.getChildCount();
  let className = 'blue-cluster';
  if (count >= 10) className = 'red-cluster';
  else if (count >= 5) className = 'yellow-cluster';
  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `custom-cluster ${className}`,
    iconSize: L.point(40, 40, true),
  });
};


export type Report = {
  id: number;
  location: [number, number];
  [key: string]: any;
};



type MapViewProps = {
  pendingReports?: Report[];
  inProgressReports?: Report[];
};

export function MapView(props: MapViewProps) {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Use empty arrays if props are undefined
  const safePendingReports = props.pendingReports ?? [];
  const safeInProgressReports = props.inProgressReports ?? [];
  // Center the map on the first pending report, fallback to a default position
  const position: [number, number] =
    safePendingReports.length > 0 && safePendingReports[0]?.location
      ? safePendingReports[0].location
      : [19.9, 83.1];

  return (
    <div className="space-y-4">
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
          <MapContainer center={position} zoom={13} style={{ height: '600px', width: '100%' }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {/* In Progress Reports: Green Pins */}
            {safeInProgressReports.map((report) => (
              <Marker
                key={`inprogress-${report.id}`}
                position={report.location as [number, number]}
                icon={greenIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedReport(report);
                    setModalOpen(true);
                  },
                }}
              />
            ))}

            {/* Pending Reports: Clustered Red Pins */}
            <MarkerClusterGroup iconCreateFunction={iconCreateFunction}>
              {safePendingReports.map((report) => (
                <Marker
                  key={`pending-${report.id}`}
                  position={report.location as [number, number]}
                  icon={redIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedReport(report);
                      setModalOpen(true);
                    },
                  }}
                />
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>

        {/* Active Reports Counter */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-slate-200 z-[1000]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-slate-900">{safePendingReports.length + safeInProgressReports.length}</p>
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

      {/* Cluster CSS */}
      <style jsx global>{`
        .custom-cluster {
          border-radius: 50%;
          background: #fff;
          text-align: center;
          font-weight: bold;
          line-height: 40px;
          width: 40px;
          height: 40px;
          box-shadow: 0 0 8px rgba(0,0,0,0.15);
        }
        .red-cluster {
          background: #ff4d4f;
          color: #fff;
          border: 2px solid #b71c1c;
        }
        .yellow-cluster {
          background: #ffe066;
          color: #333;
          border: 2px solid #fbc02d;
        }
        .blue-cluster {
          background: #4f8cff;
          color: #fff;
          border: 2px solid #1565c0;
        }
      `}</style>
    </div>
  );
}
